import type { Context, Next } from 'hono';
import { decodeToken, type DecodedToken, createAccessTokenInvalidError, createLoginRequiredError } from '../libs/utils';
import { hgetall } from '../database/cache';
import type { PublicUserInfo } from '../types';

export const isAuthenticated = async (context : Context, next : Next) : Promise<void> => {
    const authHeader : string | undefined = context.req.header('authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ')) throw createLoginRequiredError();

    const accessToken : string | undefined = authHeader.split(' ')[1];
    if(!accessToken) throw createAccessTokenInvalidError();

    const decodedToken : DecodedToken = decodeToken(accessToken, process.env.ACCESS_TOKEN);
    if(!decodedToken) throw createAccessTokenInvalidError();

    const user : PublicUserInfo = await hgetall(`user:${decodedToken.id}`);
    if(!user) throw createLoginRequiredError();
    context.set('user', user);
    await next();
};