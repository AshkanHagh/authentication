import { hget, hgetall, findRolePermission, set, expire } from '../database/cache';
import { searchUsersByEmail, insertUserDetail, type UserSearchResult } from '../database/queries';
import { emailEvent } from '../events';
import ErrorHandler from '../utils/errorHandler';
import { generateActivationLink, verifyActivationToken, comparePassword, hashPassword, 
    createEmailAlreadyExistsError, createEmailOrPasswordMatchError, generateActivationCode, createInvalidVerifyCodeError,
    decodeToken, createLoginRequiredError
} from '../utils';
import type { ActivationLink, PublicUserInfo, SelectUser, SelectUserWithPermission, VerifyActivationCodeToken } from '../types';
import type { RegisterSchema } from '../schemas';
import { wasIpActiveRecently } from '../middlewares/iphandler';

export const fetchPermissionAndCombineWithUser = async <C extends 'nullable' | 'none'>(userDetail : PublicUserInfo, condition : C) 
: Promise<SelectUserWithPermission | null> => {
    const prefixRole : string[] = userDetail.role?.toString().split(',')!;

    const userRolePermission = userDetail && Object.keys(userDetail).length 
    ? condition === 'nullable' ? await findRolePermission(prefixRole) : await findRolePermission(userDetail.role!) : null;
    return userRolePermission ? {...userDetail, role : prefixRole, permissions : userRolePermission} : null;
}

export const registerService = async (email : string, password : string, name : string) : Promise<string> => {
    try {
        const emailSearchCache : string = await hget<string>(`user${email}`, 'email');
        const isEmailExists : Pick<SelectUser, 'email'> | string | null = emailSearchCache 
        ? emailSearchCache : await searchUsersByEmail(email, 'email', 'none');

        if(isEmailExists) throw createEmailAlreadyExistsError();
        const registerBody : RegisterSchema = {email : email.toLowerCase(), password : await hashPassword(password), name};

        const { magicLink } : ActivationLink = generateActivationLink(registerBody);
        emailEvent.emit('send-magic-link', email, magicLink);
        return 'A verification email with a magic link has been sent to your address. Please check your inbox.';
        
    } catch (err : unknown) {
        const error = err as ErrorHandler
        throw new ErrorHandler(error.message, error.statusCode);
    }
};

export type AccountState = 'existingAccount' | 'newAccount';
export const verifyAccountService = async (activationToken : string, ipAddress : string, state : AccountState, verifyCode? : string) 
: Promise<SelectUserWithPermission> => {
    try {
        const newAccountCondition = async (activationToken : string) : Promise<SelectUserWithPermission> => {
            const {email, password, name} : RegisterSchema = verifyActivationToken(activationToken);
            const emailSearchCache : string = await hget(`user:${email}`, 'email');

            const checkEmailExists : (Pick<SelectUser, 'email'> | string) | null = 
            emailSearchCache ? emailSearchCache : await searchUsersByEmail(email, 'email', 'none');
            if(checkEmailExists) throw createEmailAlreadyExistsError();

            const userDetail : PublicUserInfo = await insertUserDetail({name, email, password});
            if(!await wasIpActiveRecently(ipAddress)) await set(`ip_activity:${ipAddress}`, '1', 4 * 24 * 60 * 60);
            return {...userDetail, permissions : []};
        };
        const existingCondition = async (activationToken : string) : Promise<SelectUserWithPermission> => {
            const { activationCode, user } = verifyActivationToken(activationToken) as VerifyActivationCodeToken;
            if(verifyCode !== activationCode) throw createInvalidVerifyCodeError();

            const emailSearchCache : PublicUserInfo = await hgetall(`user:${user.email}`);
            const userDetail : SelectUserWithPermission | null = await fetchPermissionAndCombineWithUser(emailSearchCache, 'nullable');
            if(!await wasIpActiveRecently(ipAddress)) await set(`ip_activity:${ipAddress}`, '1', 4 * 24 * 60 * 60);
            return userDetail ? userDetail : await searchUsersByEmail(user.email, 'full', 'password') as SelectUserWithPermission;
        };

        const handelCondition : Record<AccountState, (activationCode : string) => Promise<SelectUserWithPermission>> = {
            existingAccount : existingCondition, newAccount : newAccountCondition
        }
        return await handelCondition[state](activationToken);
        
    } catch (err : unknown) {
        const error = err as ErrorHandler
        throw new ErrorHandler(error.message, error.statusCode);
    }
}

export const emailCheckService = async (email : string) : Promise<boolean> => {
    const userCacheDetail : PublicUserInfo = await hgetall(`user:${email}`);
    const userDetail = userCacheDetail && Object.keys(userCacheDetail).length ? userCacheDetail : await searchUsersByEmail(
        email, 'email', 'none'
    )
    return userDetail ? true : false;
}

export type RedirectionStates = 'needVerify' | 'loggedIn';
export type LoginRedirectionBaseOnActivity<S> = S extends 'needVerify' ? {state : 'needVerify', activationToken : string} : {
    state : 'loggedIn', userDetail : SelectUserWithPermission
};
export const loginService = async (email : string, pass : string, ipAddress : string, redirection : RedirectionStates) 
: Promise<LoginRedirectionBaseOnActivity<typeof redirection>> => {
    try {
        const currentUserDetail : UserSearchResult<'full', 'none'> | null = await searchUsersByEmail(email, 'full', 'none');
        const passwordMatch : boolean = await comparePassword(pass, currentUserDetail?.password || '');
        if(!currentUserDetail || !passwordMatch) throw createEmailOrPasswordMatchError();

        if(redirection === 'loggedIn') {
            const {password, ...rest} = currentUserDetail;
            await expire(`ip_activity:${ipAddress}`, 4 * 24 * 60 * 60);
            return {state : 'loggedIn', userDetail : rest!};
        };
        
        const { activationCode, activationToken } = generateActivationCode({email, password : pass});
        emailEvent.emit('send-activation-code', email, activationCode);
        return {state : 'needVerify', activationToken};
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}

export const socialAuthService = async (name : string, email : string, image : string, ipAddress : string) : Promise<SelectUserWithPermission> => {
    try {
        const userCacheDetail : PublicUserInfo = await hgetall(`user:${email}`);
        const userDetailWithRole : SelectUserWithPermission | null = await fetchPermissionAndCombineWithUser(userCacheDetail, 'nullable');
        const userDetail : SelectUserWithPermission | null = userDetailWithRole ? userDetailWithRole : await searchUsersByEmail(
            email, 'full', 'password'
        );
        const insertUserInformation = async () : Promise<SelectUserWithPermission> => {
            const userDetail : PublicUserInfo = await insertUserDetail({name, email, image});
            return {...userDetail, permissions : []};
        }
        if(!await wasIpActiveRecently(ipAddress)) await set(`ip_activity:${ipAddress}`, '1', 4 * 24 * 60 * 60);
        return userDetail ? userDetail : await insertUserInformation();
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}

export const refreshTokenService = async (refreshToken : string, ipAddress : string) : Promise<SelectUserWithPermission> => {
    try {
        const decodedUser : PublicUserInfo = decodeToken(refreshToken, process.env.REFRESH_TOKEN);
        const currentUserCache : PublicUserInfo = await hgetall(`user:${decodedUser.id}`);
        const userDetailWithRole : SelectUserWithPermission | null = await fetchPermissionAndCombineWithUser(currentUserCache, 'nullable');

        if(!decodedUser || !userDetailWithRole) throw createLoginRequiredError();
        if(!await wasIpActiveRecently(ipAddress)) await set(`ip_activity:${ipAddress}`, '1', 4 * 24 * 60 * 60);
        return userDetailWithRole
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}