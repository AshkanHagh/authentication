import type { Context } from 'hono';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { type PublicUserInfo, type SelectUserWithPermission } from '../types';
import { cookieOptionSchema, type CookieOption } from '../schemas';
import { createValidationError } from './customErrors';
import { setCookie } from 'hono/cookie';
import ErrorHandler from './errorHandler';
import { cacheEvent } from '../events';

const accessTokenExpires : number = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
const refreshTokenExpires : number = parseInt(process.env.REFRESH_TOKEN_EXPIRE);

export const accessTokenOption = () : CookieOption => {
    const maxAgeInSecond : number = accessTokenExpires * 60;
    const cookieOption = <CookieOption>{
        expires : new Date(Date.now() + maxAgeInSecond * 1000),
        maxAge : maxAgeInSecond,
        httpOnly : true,
        sameSite : 'lax',
        secure : process.env.NODE_ENV === 'production' ? true : false
    }
    if(!cookieOptionSchema.safeParse(cookieOption).success) {
        throw createValidationError(cookieOptionSchema.safeParse(cookieOption).error?.issues[0].message || 'Cookie error');
    }
    return cookieOption;
}

export const refreshTokenOption = () : CookieOption => {
    const maxAgeInSecond : number = refreshTokenExpires * 24 * 60 * 60;
    const cookieOption = <CookieOption>{
        expires : new Date(Date.now() + maxAgeInSecond * 1000),
        maxAge : maxAgeInSecond,
        httpOnly : true,
        sameSite : 'lax',
        secure : process.env.NODE_ENV === 'production' ? true : false
    }
    if(!cookieOptionSchema.safeParse(cookieOption).success) {
        throw createValidationError(cookieOptionSchema.safeParse(cookieOption).error?.issues[0].message || 'Cookie error');
    }
    return cookieOption;
}

type AuthState = 'auth' | 'refresh';
export type AuthStateResponse = {accessToken : string; user : SelectUserWithPermission};
type ServiceStateBaseOnAuthState<T> = T extends 'refresh' ?  string : AuthStateResponse;

export const sendToken = async <T extends AuthState>(user : PublicUserInfo, context : Context, condition : T) : 
Promise<ServiceStateBaseOnAuthState<T>> => {
    try {
        const accessToken : string = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn : `${accessTokenExpires}m`});
        const refreshToken : string = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : `${refreshTokenExpires}d`});
        cacheEvent.emit('insert_user_detail', user, 'insert', refreshToken);
        
        setCookie(context, 'access_token', accessToken, accessTokenOption());
        setCookie(context, 'refresh_token', refreshToken, refreshTokenOption());
        return condition === 'refresh' ? accessToken as ServiceStateBaseOnAuthState<T> : {accessToken, user} as ServiceStateBaseOnAuthState<T>;

    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(error.message, error.statusCode);
    }
}

export type AuthDecodedToken = PublicUserInfo & JwtPayload;
export const decodeToken = (token : string, secret : string) : AuthDecodedToken => {
    return jwt.verify(token, secret) as AuthDecodedToken;
}