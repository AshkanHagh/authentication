import { getIncr, hgetall } from '../database/cache';
import { emailSearchWithCondition, insertUserDetail } from '../database/queries';
import { emailEvent } from '../events/email.event';
import ErrorHandler from '../libs/utils/errorHandler';
import { generateActivationLink, verifyActivationToken, comparePassword, hashPassword, 
    createEmailAlreadyExistsError, createEmailOrPasswordMatchError, generateActivationCode, createInvalidVerifyCodeError,
    decodeToken, createLoginRequiredError
} from '../libs/utils';
import type { ActivationLink, PublicUserInfo, SelectUser, VerifyActivationCodeToken } from '../types';

export const registerService = async (email : string, password : string) : Promise<string> => {
    try {
        const checkEmailExists : Pick<SelectUser, 'email'> = await emailSearchWithCondition(email, 'modified', 'modified');
        if(checkEmailExists) throw createEmailAlreadyExistsError();
        
        const hashedPassword : string = await hashPassword(password);
        const registerBody : Pick<SelectUser, 'email' | 'password'> = {email : email.toLowerCase(), password : hashedPassword};

        const { activationToken, magicLink } : ActivationLink = generateActivationLink(registerBody);
        emailEvent.emit('send-magic-link', email, magicLink);
        return activationToken;
        
    } catch (err : unknown) {
        const error = err as ErrorHandler
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
};

export type Condition = 'existingAccount' | 'newAccount';

export const verifyAccountService = async <C extends Condition>(activationToken : string, condition : C, activationCode? : string) : 
Promise<PublicUserInfo> => {
    try {
        const newAccountCondition = async (activationToken : string) : Promise<PublicUserInfo> => {
            const {email, password} : Pick<SelectUser, 'email' | 'password'> = verifyActivationToken(activationToken);
            const checkEmailExists : Pick<SelectUser, 'email'> = await emailSearchWithCondition(email, 'modified', 'modified');
            if(checkEmailExists) throw createEmailAlreadyExistsError();

            const userDetail : PublicUserInfo = await insertUserDetail({name : email.split('@')[0], email, password});
            return userDetail;
        };
        const existingCondition = async (activationToken : string) : Promise<PublicUserInfo> => {
            const { activationCode : code, user } = verifyActivationToken(activationToken) as VerifyActivationCodeToken;
            if(activationCode !== code) throw createInvalidVerifyCodeError();

            const userDetail : PublicUserInfo = await emailSearchWithCondition(user.email, 'full', 'modified');
            return userDetail;
        };

        const handelCondition : Record<Condition, (activationCode : string) => Promise<PublicUserInfo>> = {
            existingAccount : existingCondition, newAccount : newAccountCondition
        }
        return await handelCondition[condition](activationToken);
        
    } catch (err : unknown) {
        const error = err as ErrorHandler
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export type LoginResponse<R> = R extends PublicUserInfo ? PublicUserInfo : string;
export const loginService = async <R extends PublicUserInfo | string>(email : string, pass : string, ipAddress : string | undefined) : 
Promise<LoginResponse<R>> => {
    try {
        const checkEmailExists : SelectUser = await emailSearchWithCondition(email, 'full', 'full');
        const passwordMatch : boolean = await comparePassword(pass, checkEmailExists?.password || '');
        if(!checkEmailExists || !passwordMatch) throw createEmailOrPasswordMatchError();

        const checkUserActivity : string = await getIncr(`user_ip:${ipAddress}`);
        if(checkUserActivity) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password, ...rest} = checkEmailExists;
            return rest as LoginResponse<R>;
        }
        
        const { activationCode, activationToken } = generateActivationCode({email, password : pass});
        emailEvent.emit('send-activation-code', email, activationCode);
        return activationToken as LoginResponse<R>;
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const socialAuthService = async (name : string, email : string, image : string) : Promise<PublicUserInfo> => {
    try {
        const checkEmailExists : Pick<SelectUser, 'email'> = await emailSearchWithCondition(email, 'modified', 'modified');
        if(checkEmailExists) throw createEmailAlreadyExistsError();
        const userDetail : PublicUserInfo = await insertUserDetail({name, email, image});
        return userDetail;
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const refreshTokenService = async (refreshToken : string) : Promise<PublicUserInfo> => {
    try {
        const decodedUser : PublicUserInfo = decodeToken(refreshToken, process.env.REFRESH_TOKEN);
        const currentUserCache : PublicUserInfo = await hgetall(`user:${decodedUser.id}`);
        if(!decodedUser || Object.keys(currentUserCache).length <= 0) throw createLoginRequiredError();
        return currentUserCache
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}