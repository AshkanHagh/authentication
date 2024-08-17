import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import * as Sentry from '@sentry/bun';

class ErrorHandler extends Error {
    statusCode : StatusCode;
    constructor(message : string, statusCode : StatusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const ErrorMiddleware = async (error : unknown, context : Context) => {
    const handledError : ErrorHandler = error instanceof ErrorHandler ? error : new ErrorHandler('Internal Server Error', 500);
    Sentry.captureException(handledError.message);
    context.status(handledError.statusCode as StatusCode);
    return context.json({ success : false, message : handledError.message });
};

export default ErrorHandler;