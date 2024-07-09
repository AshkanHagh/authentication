import jwt, { type JwtPayload } from 'jsonwebtoken';
import { CatchAsyncError } from './catchAsyncError';
import type { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../libs/utils/errorHandler';
import { AccessTokenInvalidError, LoginRequiredError } from '../libs/utils';
import type { TErrorHandler, TInferSelectUser } from '../types/index.type';
import { getAllFromHashCache } from '../database/cache/index.cache';

export const isAuthenticated = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) return next(new ErrorHandler('Please login to access this recourse', 400));

        const token = authHeader.split(' ')[1];
        if(!token) return next(new ErrorHandler('Access token is not valid', 400));

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string) as JwtPayload & TInferSelectUser;
        if(!decoded) return next(new AccessTokenInvalidError());

        const user : Omit<TInferSelectUser, 'password'> = await getAllFromHashCache(`user:${decoded.id}`);
        if(Object.keys(user).length <= 0) return next(new LoginRequiredError());

        req.user = user;
        next();
        
    } catch (err) {
        const error = err as TErrorHandler;
        return next(new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode));
    }
});