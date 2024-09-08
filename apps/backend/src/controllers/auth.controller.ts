import type { SelectUserWithPermission } from '../types';
import type { Context } from 'hono';
import { sendToken, CatchAsyncError, createUserNotFoundError, type AuthStateResponse } from '../utils';
import { deleteCookie, getCookie } from 'hono/cookie';
import { del, set } from '../database/cache';
import { emailCheckService, loginService, refreshTokenService, registerService, socialAuthService, 
    verifyAccountService, type LoginRedirectionBaseOnActivity, type RedirectionStates} from '../services/auth.service';
import type { VerifyAccountSchema, LoginSchema, RegisterSchema, SocialAuth, EmailCheckSchema, 
    VerifyAccountResponse, LoginResponse, SocialAuthResponse, RefreshTokenResponse, BasicResponse,
    BasicUserIncludedResponse
} from '../schemas';
import { cacheEvent } from '../events/cache.event';
import { wasIpActiveRecently } from '../middlewares/iphandler';

export const register = CatchAsyncError(async (context: Context) => {
    const { email, password, name } = await context.req.validationData.json as RegisterSchema;
    const message : string = await registerService(email, password, name);
    return context.json({success : true, message} as BasicResponse, 201);
});

export const verifyAccount = CatchAsyncError(async (context : Context) => {
    const { token, state, code } = context.req.validationData.json as VerifyAccountSchema;
    const ipAddress : string = context.get('userIp');
    const userDetail : SelectUserWithPermission = await verifyAccountService(token, ipAddress, state, code);

    const { accessToken, user } : AuthStateResponse = await sendToken(userDetail, context, 'auth');
    return context.json({success : true, userDetail : user, accessToken} as VerifyAccountResponse, 201);
});

export const emailCheck = CatchAsyncError(async (context : Context) => {
    const { email } = context.req.validationData.query as EmailCheckSchema;
    const emailCheckResponse : boolean = await emailCheckService(email);

    const response : BasicResponse = emailCheckResponse ? {success : true, message : 'Account already exists'} : {
        success : false, message : 'Account does not exist'
    };
    return context.json(response as BasicResponse, 200);
});

const loginResponseFn = async (userDetail : SelectUserWithPermission, context : Context) : Promise<LoginResponse<'loggedIn'>> => {
    const { accessToken, user } : AuthStateResponse = await sendToken(userDetail, context, 'auth');
    return {success : true, state : 'loggedIn', userDetail : user, accessToken} as LoginResponse<'loggedIn'>;
}

export const login = CatchAsyncError(async (context : Context) => {
    const { email, password : reqPassword } = context.req.validationData.json as LoginSchema;
    const ipAddress : string = context.get('userIp');
    const redirectionState : RedirectionStates = await wasIpActiveRecently(ipAddress) ? 'loggedIn' : 'needVerify';

    const currentUserState : LoginRedirectionBaseOnActivity<typeof redirectionState> = await loginService(email, reqPassword, 
        ipAddress, redirectionState
    );
    const responseDetail = currentUserState.state === 'needVerify' ? {success : true, state : 'needVerify', 
        activationToken : currentUserState.activationToken} : await loginResponseFn(currentUserState.userDetail, context);
    return context.json(responseDetail, 201);
});

export const socialAuth = CatchAsyncError(async (context : Context) => {
    const { name, image, email } = context.req.validationData.json as SocialAuth;
    const ipAddress : string = context.get('userIp');
    const userDetail : SelectUserWithPermission = await socialAuthService(name, email.toLowerCase(), image, ipAddress);
    
    const { accessToken, user } : AuthStateResponse = await sendToken(userDetail, context, 'auth');
    return context.json({success : true, userDetail : user, accessToken} as SocialAuthResponse, 201);
});

export const logout = CatchAsyncError(async (context : Context) => {
    const { id, email } = context.get('user') as SelectUserWithPermission;
    await Promise.all([deleteCookie(context, 'access_token'), deleteCookie(context, 'refresh_token'), 
        cacheEvent.emit('handle_refresh_token', id, 'delete'), del(`user:${id}`), del(`user:${email}`)
    ]);
    return context.json({success : true, message : 'User logged out successfully'} as BasicResponse, 200);
});

export const refreshToken = CatchAsyncError(async (context : Context) => {
    const refresh_token : string | undefined = getCookie(context, 'refresh_token');
    const ipAddress : string = context.get('userIp');
    const currentUserDetail : SelectUserWithPermission = await refreshTokenService(refresh_token ?? '', ipAddress);

    const accessToken : string = await sendToken(currentUserDetail, context, 'refresh');
    return context.json({success : true, accessToken} as RefreshTokenResponse, 200);
});

export const me = CatchAsyncError(async (context : Context) => {
    const myDetail : SelectUserWithPermission = context.get('user');
    if(!myDetail || !Object.keys(myDetail).length) throw createUserNotFoundError();

    const myIpAddress : string = context.get('userIp');
    if(!await wasIpActiveRecently(myIpAddress)) await set(`ip_activity:${myIpAddress}`, '1', 4 * 24 * 60 * 60);
    return context.json({success : true, userDetail : myDetail} as BasicUserIncludedResponse, 200);
})