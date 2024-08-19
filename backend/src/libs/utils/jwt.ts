import type { Context } from 'hono';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { PublicUserInfo } from '../../types/index.type';
import { cookieOptionSchema, type CookieOption } from '../../types/zod';
import { createValidationError } from './customErrors';
import { hset } from '../../database/cache';
import { setCookie } from 'hono/cookie';
import ErrorHandler from './errorHandler';

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

type GenericCondition = 'refresh' | 'register';
export type ConditionResponse = {accessToken : string; user : PublicUserInfo};
type TokenCondition<T> = T extends 'refresh' ?  string : ConditionResponse;

export const sendToken = async <T extends GenericCondition>(user : PublicUserInfo, context : Context, condition : T) : 
Promise<TokenCondition<T>> => {
    try {
        const accessToken : string = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn : `${accessTokenExpires}m`});
        const refreshToken : string = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : `${refreshTokenExpires}d`});
        await Promise.all([hset(`user:${user.id}`, user), hset(`user:${user.email}`, user)]);
        
        setCookie(context, 'access_token', accessToken, accessTokenOption());
        setCookie(context, 'refresh_token', refreshToken, refreshTokenOption());
    
        if(condition === 'refresh') return accessToken as TokenCondition<T>;
        return {accessToken, user} as TokenCondition<T>;

    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error ocurred : ${error.message}`, error.statusCode);
    }
}

export type DecodedToken = PublicUserInfo & JwtPayload;
export const decodeToken = (token : string, secret : string) : DecodedToken => {
    return jwt.verify(token, secret) as DecodedToken;
}