import { getIncr, hget, hgetall } from '../database/cache';
import { emailSearchWithCondition, insertUserDetail } from '../database/queries';
import { emailEvent } from '../events/email.event';
import ErrorHandler from '../utils/errorHandler';
import { generateActivationLink, verifyActivationToken, comparePassword, hashPassword, 
    createEmailAlreadyExistsError, createEmailOrPasswordMatchError, generateActivationCode, createInvalidVerifyCodeError,
    decodeToken, createLoginRequiredError
} from '../utils';
import type { ActivationLink, PublicUserInfo, SelectUser, VerifyActivationCodeToken } from '../types';
import type { RegisterSchema } from '../schemas/zod.schemas';

export const registerService = async (email : string, password : string, name : string) : Promise<string> => {
    try {
        const emailSearchCache : string = await hget<string>(`user${email}`, 'email', 604800);
        const isEmailExists : Pick<SelectUser, 'email'> | string = emailSearchCache && Object.keys(emailSearchCache).length 
        ? emailSearchCache : await emailSearchWithCondition(email, 'modified', 'modified');

        if(isEmailExists) throw createEmailAlreadyExistsError();
        const registerBody : RegisterSchema = {email : email.toLowerCase(), password : await hashPassword(password), name};

        const { magicLink } : ActivationLink = generateActivationLink(registerBody);
        emailEvent.emit('send-magic-link', email, magicLink);
        return 'A verification email with a magic link has been sent to your address. Please check your inbox.';
        
    } catch (err : unknown) {
        const error = err as ErrorHandler
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
};

export type VerifyAccountCondition = 'existingAccount' | 'newAccount';
export const verifyAccountService = async <C extends VerifyAccountCondition>(activationToken : string, condition : C, 
    verifyCode? : string) : Promise<PublicUserInfo> => {
    try {
        const newAccountCondition = async (activationToken : string) : Promise<PublicUserInfo> => {
            const {email, password, name} : RegisterSchema = verifyActivationToken(activationToken);
            const emailSearchCache : string = await hget(`user:${email}`, 'email', 604800);
            const checkEmailExists : (Pick<SelectUser, 'email'> | string) = emailSearchCache && Object.keys(emailSearchCache).length 
            ? emailSearchCache : await emailSearchWithCondition(email, 'modified', 'modified');

            if(checkEmailExists) throw createEmailAlreadyExistsError();
            return await insertUserDetail({name, email, password});
        };
        const existingCondition = async (activationToken : string) : Promise<PublicUserInfo> => {
            const { activationCode, user } = verifyActivationToken(activationToken) as VerifyActivationCodeToken;
            if(verifyCode !== activationCode) throw createInvalidVerifyCodeError();

            const emailSearchCache : PublicUserInfo = await hgetall(`user:${user.email}`, 604800);
            return emailSearchCache && Object.keys(emailSearchCache).length ? emailSearchCache : await emailSearchWithCondition(
                user.email, 'full', 'modified'
            );
        };

        const handelCondition : Record<VerifyAccountCondition, (activationCode : string) => Promise<PublicUserInfo>> = {
            existingAccount : existingCondition, newAccount : newAccountCondition
        }
        return await handelCondition[condition](activationToken);
        
    } catch (err : unknown) {
        const error = err as ErrorHandler
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const emailCheckService = async (email : string) : Promise<PublicUserInfo | undefined> => {
    const userCacheDetail : PublicUserInfo | undefined = await hgetall(`user:${email}`, 604800);
    return userCacheDetail && Object.keys(userCacheDetail).length ? userCacheDetail 
    : await emailSearchWithCondition(email, 'full', 'modified')
}

export type LoginServiceResponseDetail<R> = R extends PublicUserInfo ? PublicUserInfo : string;
export const loginService = async <R extends PublicUserInfo | string>(email : string, pass : string, ipAddress : string | undefined) : 
Promise<LoginServiceResponseDetail<R>> => {
    try {
        const isEmailExists : SelectUser = await emailSearchWithCondition(email, 'full', 'full');
        const passwordMatch : boolean = await comparePassword(pass, isEmailExists?.password || '');
        if(!isEmailExists || !passwordMatch) throw createEmailOrPasswordMatchError();

        const checkUserActivity : string = await getIncr(`user_ip:${ipAddress}`, 604800);
        const {password, ...rest} = isEmailExists;
        if(checkUserActivity || checkUserActivity.length) return rest as LoginServiceResponseDetail<R>;
        
        const { activationCode, activationToken } = generateActivationCode({email, password : pass});
        emailEvent.emit('send-activation-code', email, activationCode);
        return activationToken as LoginServiceResponseDetail<R>;
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const socialAuthService = async (name : string, email : string, image : string) : Promise<PublicUserInfo> => {
    try {
        const userCacheDetail : PublicUserInfo = await hgetall<PublicUserInfo>(`user:${email}`, 604800);
        const desiredUser : PublicUserInfo = userCacheDetail && Object.keys(userCacheDetail).length ? userCacheDetail 
        : await emailSearchWithCondition(email, 'full', 'modified')
        return desiredUser ? desiredUser : await insertUserDetail({name, email, image});
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const refreshTokenService = async (refreshToken : string) : Promise<PublicUserInfo> => {
    try {
        const decodedUser : PublicUserInfo = decodeToken(refreshToken, process.env.REFRESH_TOKEN);
        const currentUserCache : PublicUserInfo = await hgetall(`user:${decodedUser.id}`, 604800);
        if(!decodedUser || !Object.keys(currentUserCache).length) throw createLoginRequiredError();
        return currentUserCache
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}