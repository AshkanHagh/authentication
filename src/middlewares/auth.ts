import type { Context, Next } from 'hono';
import { CatchAsyncError } from '../libs/utils/catchAsyncError';
import { createAccessTokenInvalidError, createLoginRequiredError } from '../libs/utils/customErrors';
import { decodeToken, type DecodedToken } from '../libs/utils/jwt';
import { hgetall } from '../database/queries';
import type { UserModel } from '../types/index.type';

export const isAuthenticated = CatchAsyncError(async (context : Context, next : Next) : Promise<void> => {
    const authHeader : string | undefined = context.req.header('authorization');
    if(!authHeader || authHeader.startsWith('Bearer ')) throw createLoginRequiredError();

    const accessToken : string | undefined = authHeader.split(' ')[1];
    if(!accessToken) throw createAccessTokenInvalidError();

    const decodedToken : DecodedToken = decodeToken(accessToken, process.env.ACCESS_TOKEN);
    if(!decodedToken) throw createAccessTokenInvalidError();

    const user : Omit<UserModel, 'password'> = await hgetall(`user:${decodedToken.id}`);
    if(!user) throw createLoginRequiredError();
    context.set('user', user);
    await next();
});