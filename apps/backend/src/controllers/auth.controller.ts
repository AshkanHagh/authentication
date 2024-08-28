import type { PublicUserInfo } from '../types';
import type { ConnInfo } from 'hono/conninfo';
import type { Context } from 'hono';
import { sendToken, type ConditionResponse, CatchAsyncError } from '../utils';
import { deleteCookie, getCookie } from 'hono/cookie';
import { del } from '../database/cache';
import { emailCheckService, loginService, refreshTokenService, registerService, socialAuthService, 
    verifyAccountService, type LoginServiceResponseDetail
} from '../services/auth.service';
import type { VerifyAccountSchema, LoginSchema, RegisterSchema, SocialAuth, EmailCheckSchema, 
    RegisterResponse, verifyAccountResponse, EmailCheckResponse, LoginResponse, SocialAuthResponse, LogoutResponse, RefreshTokenResponse
} from '../schemas';

export const register = CatchAsyncError(async (context: Context) => {
    const { email, password, name } = await context.req.validationData.json as RegisterSchema;
    const message : string = await registerService(email, password, name);
    return context.json({success : true, message} as RegisterResponse, 201);
});

export const verifyAccount = CatchAsyncError(async (context : Context) => {
    const { token, condition, code } = context.req.validationData.query as VerifyAccountSchema;
    const userDetail : PublicUserInfo = await verifyAccountService(token, condition, code);

    const { accessToken, user } : ConditionResponse = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken} as verifyAccountResponse, 201);
});

export const emailCheck = CatchAsyncError(async (context : Context) => {
    const { email } = context.req.validationData.query as EmailCheckSchema;
    const emailCheck : undefined | PublicUserInfo = await emailCheckService(email);

    const response : EmailCheckResponse = emailCheck ? {success : true, name : emailCheck.name!} : {
        success : false, message : 'Account does not exist'
    };
    return context.json(response as EmailCheckResponse, 200);
});

export const login = CatchAsyncError(async (context : Context) => {
    const { email, password : reqPassword } = context.req.validationData.json as LoginSchema;
    const connectionInfo : ConnInfo = context.get('current_user_ip');
    const userDetail : LoginServiceResponseDetail<PublicUserInfo | string> = await loginService(
        email, reqPassword, connectionInfo.remote.address
    );

    const loginResponseFn = async (userDetail : PublicUserInfo) : Promise<LoginResponse> => {
        const { accessToken, user } : ConditionResponse = await sendToken(userDetail, context, 'register');
        return {success : true, userDetail : user, accessToken};
    }
    const responseDetail : LoginResponse = typeof userDetail === 'string' ? {success : true, activationToken : userDetail} 
    : await loginResponseFn(userDetail)
    return context.json(responseDetail, 201);
});

export const socialAuth = CatchAsyncError(async (context : Context) => {
    const { name, image, email } = context.req.validationData.json as SocialAuth;
    const userDetail : PublicUserInfo = await socialAuthService(name, email.toLowerCase(), image);

    const { accessToken, user } : ConditionResponse = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken} as SocialAuthResponse, 201);
});

export const logout = CatchAsyncError(async (context : Context) => {
    const { id, email } = context.get('user') as PublicUserInfo;
    deleteCookie(context, 'access_token');
    deleteCookie(context, 'refresh_token');

    await Promise.all([del(`user:${id}`), del(`user:${email}`)]);
    return context.json({success : true, message : 'User logged out successfully'} as LogoutResponse, 200);
});

export const refreshToken = CatchAsyncError(async (context : Context) => {
    const refresh_token : string | undefined = getCookie(context, 'refresh_token');
    const currentUserDetail : PublicUserInfo = await refreshTokenService(refresh_token ?? '');

    const accessToken : string = await sendToken(currentUserDetail, context, 'refresh');
    return context.json({success : true, accessToken} as RefreshTokenResponse, 200);
});