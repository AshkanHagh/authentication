import type { TErrorHandler, TInferSelectUser, TVerifyActivationToken } from '../types/index.type';
import { getAllFromHashCache } from '../database/cache/index.cache';
import { findFirstUser, insertUserAuthInfo } from '../database/queries/user.query';
import emailEventEmitter from '../events/email.event';
import { EmailOrUsernameExistsError, InvalidEmailOrPasswordError, InvalidVerifyCode, LoginRequiredError, TokenRefreshError, comparePassword, createActivationToken, decodedToken, hashPassword, verifyActivationToken } from '../libs/utils';
import ErrorHandler from '../libs/utils/errorHandler';

export const registerService = async (username : string, email : string, password : string) : Promise<string> => {
    try {
        const isUserExists : TInferSelectUser | undefined = await findFirstUser(email);
        if(isUserExists) throw new EmailOrUsernameExistsError();
        
        const hashedPassword : string = await hashPassword(password);
        const user = {username : username.toLowerCase(), email : email.toLowerCase(), password : hashedPassword} as TInferSelectUser;

        const { activationCode, activationToken } = createActivationToken(user);
        emailEventEmitter.emit('registerEmail', email, activationCode);
        return activationToken;
        
    } catch (err) {
        const error = err as TErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const verifyAccountService = async (activationToken : string, activationCode : string) : Promise<void> => {
    try {
        const token : TVerifyActivationToken = verifyActivationToken(activationToken);
        if(token.activationCode !== activationCode) throw new InvalidVerifyCode();

        const { username, email, password } = token.user;
        const isUserExists : TInferSelectUser | undefined = await findFirstUser(email);
        if(isUserExists) throw new EmailOrUsernameExistsError();

        insertUserAuthInfo(email, username, password);
        
    } catch (err) {
        const error = err as TErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const loginService = async (email : string, password : string) : Promise<TInferSelectUser> => {
    try {
        const isUserExists : TInferSelectUser | undefined = await findFirstUser(email.toLowerCase());
        const isPasswordMatch : boolean = await comparePassword(password, isUserExists?.password || '');

        if(!isUserExists || !isPasswordMatch) throw new InvalidEmailOrPasswordError();
        return isUserExists;
        
    } catch (err) {
        const error = err as TErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

export const refreshTokenService = async (refreshToken : string) : Promise<TInferSelectUser> => {
    try {
        const decoded : TInferSelectUser = decodedToken(refreshToken);
        if(!decoded) throw new LoginRequiredError();

        const session : TInferSelectUser = await getAllFromHashCache(`user:${decoded.id}`);
        if(Object.keys(session).length <= 0) throw new TokenRefreshError();

        return session;
        
    } catch (err) {
        const error = err as TErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}