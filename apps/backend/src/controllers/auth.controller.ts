import type { SelectUserWithPermission } from '../types';
import type { Context } from 'hono';
import { sendToken, type ConditionResponse, CatchAsyncError, createUserNotFoundError } from '../utils';
import { deleteCookie, getCookie } from 'hono/cookie';
import { del } from '../database/cache';
import { emailCheckService, loginService, refreshTokenService, registerService, socialAuthService, 
    verifyAccountService, type LoginServiceResponseDetail
} from '../services/auth.service';
import type { VerifyAccountSchema, LoginSchema, RegisterSchema, SocialAuth, EmailCheckSchema, 
    VerifyAccountResponse, LoginResponse, SocialAuthResponse, RefreshTokenResponse, BasicResponse,
    BasicUserIncludedResponse
} from '../schemas';
import { cacheEvent } from '../events/cache.event';
import { handelIpRequest } from '../middlewares/iphandler';

export const register = CatchAsyncError(async (context: Context) => {
    const { email, password, name } = await context.req.validationData.json as RegisterSchema;
    const message : string = await registerService(email, password, name);
    return context.json({success : true, message} as BasicResponse, 201);
});

export const verifyAccount = CatchAsyncError(async (context : Context) => {
    const { token, condition, code } = context.req.validationData.json as VerifyAccountSchema;
    const connectionInfo : string = context.get('userIp');
    const userDetail : SelectUserWithPermission = await verifyAccountService(token, connectionInfo, condition, code);

    const { accessToken, user } : ConditionResponse = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken} as VerifyAccountResponse, 201);
});

export const emailCheck = CatchAsyncError(async (context : Context) => {
    const { email } = context.req.validationData.query as EmailCheckSchema;
    const emailCheck : boolean = await emailCheckService(email);

    const response : BasicResponse = emailCheck ? {success : true, message : 'Account already exists'} : {
        success : false, message : 'Account does not exist'
    };
    return context.json(response as BasicResponse, 200);
});

export const login = CatchAsyncError(async (context : Context) => {
    const { email, password : reqPassword } = context.req.validationData.json as LoginSchema;
    const connectionInfo : string = context.get('userIp');
    const loginDetail : LoginServiceResponseDetail<SelectUserWithPermission | string> = await loginService(
        email, reqPassword, connectionInfo
    );
    const loginResponseFn = async (userDetail : SelectUserWithPermission) : Promise<LoginResponse<'loggedIn'>> => {
        const { accessToken, user } : ConditionResponse = await sendToken(userDetail, context, 'register');
        return {success : true, condition : 'loggedIn', userDetail : user, accessToken} as LoginResponse<'loggedIn'>;
    }
    const responseDetail : LoginResponse<'loggedIn' | 'needVerify'> = typeof loginDetail === 'string' 
    ? {success : true, condition : 'needVerify', activationToken : loginDetail} : await loginResponseFn(loginDetail)
    return context.json(responseDetail as LoginResponse<typeof responseDetail.condition>, 201);
});

export const socialAuth = CatchAsyncError(async (context : Context) => {
    const { name, image, email } = context.req.validationData.json as SocialAuth;
    const connectionInfo : string = context.get('userIp');
    const userDetail : SelectUserWithPermission = await socialAuthService(name, email.toLowerCase(), image, connectionInfo);
    
    const { accessToken, user } : ConditionResponse = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken} as SocialAuthResponse, 201);
});

export const logout = CatchAsyncError(async (context : Context) => {
    const { id, email } = context.get('user') as SelectUserWithPermission;
    await Promise.all([deleteCookie(context, 'access_token'), deleteCookie(context, 'refresh_token'), 
        cacheEvent.emit('handle_refresh_token', id, 'delete'),
    ]);

    await Promise.all([del(`user:${id}`), del(`user:${email}`)]);
    return context.json({success : true, message : 'User logged out successfully'} as BasicResponse, 200);
});

export const refreshToken = CatchAsyncError(async (context : Context) => {
    const refresh_token : string | undefined = getCookie(context, 'refresh_token');
    const connectionInfo : string = context.get('userIp');
    const currentUserDetail : SelectUserWithPermission = await refreshTokenService(refresh_token ?? '', connectionInfo);

    const accessToken : string = await sendToken(currentUserDetail, context, 'refresh');
    return context.json({success : true, accessToken} as RefreshTokenResponse, 200);
});

export const userDetail = CatchAsyncError(async (context : Context) => {
    const userDetail : SelectUserWithPermission = context.get('user');
    if(!userDetail || !Object.keys(userDetail)) throw createUserNotFoundError();

    await handelIpRequest(context.get('userIp'));
    return context.json({success : true, userDetail} as BasicUserIncludedResponse, 200);
})