import type { Context } from 'hono';

type AsyncRequestHandler<T> = (context: Context) => T;

export const CatchAsyncError = <T>(theFunc: AsyncRequestHandler<T>) => (context: Context) => {
    return Promise.resolve(theFunc(context)).catch(error => {
        return context.json({ success: false, message: error.message }, 500);
    });
};
