import type { Context } from 'hono';
import { emailCheckService, loginService, refreshTokenService, registerService, socialAuthService, 
    verifyAccountService } from '../services/auth.service';
import type { PublicUserInfo, VerifyAccountSchema, LoginSchema, RegisterSchema, SocialAuth, EmailCheckSchema } from '../types';
import { sendToken, type ConditionResponse, CatchAsyncError } from '../libs/utils';
import type { ConnInfo } from 'hono/conninfo';
import { deleteCookie, getCookie } from 'hono/cookie';
import { del } from '../database/cache';

export const register = CatchAsyncError(async (context: Context) => {
    const { email, password, name } = await context.req.validationData.json as RegisterSchema;
    const activationToken : string = await registerService(email, password, name);
    return context.json({success : true, activationToken}, 200);
});

export const verifyAccount = CatchAsyncError(async (context : Context) => {
    const { token, condition, code } = context.req.validationData.query as VerifyAccountSchema;
    const userDetail : PublicUserInfo = await verifyAccountService(token, condition, code);

    const { accessToken, user } = await sendToken(userDetail, context, 'register') as ConditionResponse;
    return context.json({success : true, userDetail : user, accessToken});
});

export const emailCheck = CatchAsyncError(async (context : Context) => {
    const { email } = context.req.validationData.query as EmailCheckSchema;
    const emailCheck : string | PublicUserInfo = await emailCheckService(email);
    if (typeof emailCheck === 'string') return context.json({success : false, message : emailCheck});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...rest } = emailCheck;
    return context.json({success : true, name});
});

export const login = CatchAsyncError(async (context : Context) => {
    const { email, password : reqPassword } = context.req.validationData.json as LoginSchema;
    const connectionInfo : ConnInfo = context.get('current_user_ip');
    const userDetail = await loginService(email, reqPassword, connectionInfo.remote.address);

    if(typeof userDetail === 'string') return context.json({success : true, activationToken : userDetail});
    const { accessToken, user } = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken});
});

export const socialAuth = CatchAsyncError(async (context : Context) => {
    const { name, image, email } = context.req.validationData.json as SocialAuth;
    const userDetail : PublicUserInfo = await socialAuthService(name, email.toLowerCase(), image);

    const { accessToken, user } = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken});
});

export const logout = CatchAsyncError(async (context : Context) => {
    const { id, email } = context.get('user') as PublicUserInfo;
    deleteCookie(context, 'access_token');
    deleteCookie(context, 'refresh_token');

    await Promise.all([del(`user:${id}`), del(`user:${email}`)]);
    return context.json({success : true, message : 'User logged out successfully'});
});

export const refreshToken = CatchAsyncError(async (context : Context) => {
    const refresh_token : string | undefined = getCookie(context, 'refresh_token');
    const currentUserDetail : PublicUserInfo = await refreshTokenService(refresh_token ?? '');

    const accessToken : string = await sendToken(currentUserDetail, context, 'refresh');
    return context.json({success : true, accessToken});
});