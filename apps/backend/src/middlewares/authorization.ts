import type { Context, Next } from 'hono';
import { decodeToken, type DecodedToken, createAccessTokenInvalidError, createLoginRequiredError, CatchAsyncError, 
    createForbiddenError 
} from '../utils';
import { hgetall } from '../database/cache';
import type { PublicUserInfo, SelectUserWithPermission } from '../types';
import { z } from 'zod';
import { fetchPermissionAndCombineWithUser } from '../services/auth.service';

const tokenSchema = z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
    {message : 'Invalid jwt token format'}
);

const extractToken = (authHeader : string | undefined) : string => {
    if(!authHeader || !authHeader.startsWith('Bearer ')) throw createLoginRequiredError();
    const token : string = authHeader.split(' ')[1];
    const validationDetail : z.SafeParseReturnType<string, string> = tokenSchema.safeParse(token);
    if(!token || !validationDetail.success) throw createAccessTokenInvalidError();
    return validationDetail.data;
}

const decodeAndValidateToken = (token : string) : DecodedToken => {
    const decodedToken : DecodedToken = decodeToken(token, process.env.ACCESS_TOKEN);
    if (!decodedToken) throw createAccessTokenInvalidError();
    return decodedToken;
};

const fetchUserInfo = async (userId : string): Promise<SelectUserWithPermission> => {
    const user : PublicUserInfo = await hgetall(`user:${userId}`, 604800);
    const userDetailWithRole : SelectUserWithPermission | null = await fetchPermissionAndCombineWithUser(user, 'nullable');
    
    if(!userDetailWithRole) throw createLoginRequiredError();
    return userDetailWithRole;
}

export const isAuthenticated = CatchAsyncError(async (context : Context, next : Next) : Promise<void> => {
    const token : string = extractToken(context.req.header('authorization'));
    const decodedToken : DecodedToken = decodeAndValidateToken(token);
    const user : SelectUserWithPermission = await fetchUserInfo(decodedToken.id);
    
    context.set('user', user);
    await next();
});

export const authorizedRoles = (...authorizedRoles : Array<string>) => {
    return CatchAsyncError(async (context : Context, next : Next) => {
        const { role } = context.get('user') as SelectUserWithPermission;
        if(!role?.some(role => authorizedRoles.includes(role))) throw createForbiddenError();
        await next();
    });
};