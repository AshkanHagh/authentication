import type { Context } from 'hono';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { CookieOptionSchema, type CookieOption, type UserModel } from '../../types/index.type';
import { createValidationError } from './customErrors';
import { hset } from '../../database/queries';
import { setCookie } from 'hono/cookie';

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
const refreshTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE);

export const accessTokenOption = () : CookieOption => {
    const cookieOption = <CookieOption>{
        expire : new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
        maxAge : accessTokenExpire * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : 'lax',
        secure : process.env.NODE_ENV === 'production' ? true : false
    }
    if(CookieOptionSchema.safeParse(cookieOption)) throw createValidationError(CookieOptionSchema.safeParse(cookieOption).error!.message);
    return cookieOption;
}

export const refreshTokenOption = () : CookieOption => {
    const cookieOption = <CookieOption>{
        expire : new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
        maxAge : refreshTokenExpire * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : 'lax',
        secure : process.env.NODE_ENV === 'production' ? true : false
    }
    if(CookieOptionSchema.safeParse(cookieOption)) throw createValidationError(CookieOptionSchema.safeParse(cookieOption).error!.message);
    return cookieOption;
}

type Condition = 'refresh' | 'register';
type Response = {accessToken : string; user : UserModel};
type TokenCondition<T> = T extends 'refresh' ?  string : Response;

export const sendToken = async <T extends Condition>(user : UserModel, context : Context, condition : T) : Promise<TokenCondition<T>> => {
    const accessToken : string = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn : `${accessTokenExpire}m`});
    const refreshToken : string = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn : `${refreshTokenExpire}d`});
    await Promise.all([hset(`user:${user.id}`, user), hset(`user:${user.email}`, user)]);
    
    setCookie(context, 'access_token', accessToken, accessTokenOption());
    setCookie(context, 'refresh_token', refreshToken, refreshTokenOption());

    if(condition === 'refresh') return accessToken as TokenCondition<T>;
    return {accessToken, user} as TokenCondition<T>;
}

export type DecodedToken = UserModel & JwtPayload;

export const decodeToken = (token : string, secret : string) : DecodedToken => {
    return jwt.verify(token, secret) as DecodedToken;
}