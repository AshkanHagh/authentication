import type { Context } from 'hono';
import { CatchAsyncError } from '../libs/utils/catchAsyncError';
import type { RegisterSchema } from '../types/zod';
import { loginService, registerService, verifyMagicLinkService, type LoginResponse } from '../services/auth.service';
import type { PublicUserInfo, VerifyMagicLinkToken } from '../types/index.type';
import { sendToken, type ConditionResponse } from '../libs/utils';
import type { ConnInfo } from 'hono/conninfo';

export const register = CatchAsyncError(async (context: Context) => {
    const { email, password } = await context.req.validationData.json as RegisterSchema;
    const activationToken : string = await registerService(email, password);
    return context.json({success : true, activationToken}, 200);
});

export const verifyMagicLink = CatchAsyncError(async (context : Context) => {
    const { token, condition, code } = context.req.validationData.query as VerifyMagicLinkToken;
    const userDetail : PublicUserInfo = await verifyMagicLinkService(token, condition, code);

    const { accessToken, user } = await sendToken(userDetail, context, 'register') as ConditionResponse;
    return context.json({success : true, userDetail : user, accessToken});
});

export const login = CatchAsyncError(async (context : Context) => {
    const { email, password : reqPassword } = context.req.validationData.json as RegisterSchema;
    const connectionInfo : ConnInfo = context.get('current_user_ip');
    const userDetail = await loginService(email, reqPassword, connectionInfo.remote.address);

    if(typeof userDetail === 'string') return context.json({success : true, activationToken : userDetail});
    const { accessToken, user } = await sendToken(userDetail, context, 'register');
    return context.json({success : true, userDetail : user, accessToken});
});