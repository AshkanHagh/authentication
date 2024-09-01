import { z } from 'zod';
import { selectUserPublicInfoSchema } from '../models/schema';

export type MakeKeysRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = {[P in keyof T]: T[P] | null | undefined};

export const registerResponseSchema = z.object({
    success : z.boolean(),
    message : z.string()
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const verifyAccountResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema.nullish(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    )
});
export type VerifyAccountResponse = z.infer<typeof verifyAccountResponseSchema>;

export const emailCheckResponseSchema = z.object({
    success : z.boolean(),
    message : z.string(),
});
export type EmailCheckResponse = z.infer<typeof emailCheckResponseSchema>;

export const loginResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema.nullish(),
    activationToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).optional(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).optional(),
    condition : z.enum(['loggedIn', 'needVerify'])
});
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

type LoginState = 'loggedIn' | 'needVerify';
type ConditionalLoginResponse<C extends LoginState> = C extends 'loggedIn' 
? Omit<LoginResponseSchema, 'activationToken' | 'condition'> : Omit<LoginResponseSchema, 'condition' | 'userDetail' | 'accessToken'>

export type LoginResponse<C extends LoginState> = ConditionalLoginResponse<C> & {condition : C};

export const socialAuthResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema.nullish(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).optional()
});
export type SocialAuthResponse = z.infer<typeof socialAuthResponseSchema>;

export const logoutResponseSchema = z.object({
    success : z.boolean(),
    message : z.string().min(1)
});
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

export const refreshTokenResponseSchema = z.object({
    success : z.boolean(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    )
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export { selectUserPublicInfoSchema } from '../models/schema';