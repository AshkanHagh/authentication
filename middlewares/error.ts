import type { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/errorHandler';
import type { IError } from '../types';

export const ErrorMiddleware = (error : IError, req : Request, res : Response, next : NextFunction) => {

    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Internal server error';

    // wrong mongodb id error
    if(error.name === 'CastError') {
        const message = `Resource not found. Invalid ${error.path}`;
        error = new ErrorHandler(message, 400);
    }

    if(error.name === 'JsonWebTokenError') {
        const message = 'Json web token is invalid, try again';
        error = new ErrorHandler(message, 400);
    }

    if(error.name === 'TokenExpiredError') {
        const message = 'Json web token is expired, try again';
        error = new ErrorHandler(message, 400);
    }

    res.status(Number(error.statusCode)).json({message : error.message});
}