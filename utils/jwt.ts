import type { Response } from 'express';
import type { ITokenOptions, IUserModel } from '../types';
import { redis } from '../db/redis';

export const sendToken = (user : IUserModel, statusCode : number, res : Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    redis.set(user._id, JSON.stringify(user) as any);

    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

    const accessTokenOption : ITokenOptions = {
        expires : new Date(Date.now() + accessTokenExpire),
        maxAge : accessTokenExpire * 1000,
        httpOnly : true,
        sameSite : 'lax'
    }

    const refreshTokenOption : ITokenOptions = {
        expires : new Date(Date.now() + refreshTokenExpire),
        maxAge : refreshTokenExpire * 1000,
        httpOnly : true,
        sameSite : 'lax'
    }

    if(process.env.NODE_ENV === 'production') {
        accessTokenOption.secure = true
    }

    res.cookie('access_token', accessToken, accessTokenOption);
    res.cookie('refresh_token', refreshToken, refreshTokenOption);

    res.status(statusCode).json({user, accessToken});
} 