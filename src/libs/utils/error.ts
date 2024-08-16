import type { Context } from 'hono';
import type { HTTPResponseError } from 'hono/types';

export type ErrorHandler = Error | HTTPResponseError;

export const ErrorMiddleware = (error : ErrorHandler, context : Context) => {
    return context.json({success : false, message : error.message});
};