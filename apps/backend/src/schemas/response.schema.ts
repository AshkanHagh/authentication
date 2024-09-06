import { z } from 'zod';
import { selectUserPublicInfoSchema } from '../models/schema';

export type MakeKeysRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = {[P in keyof T]: T[P] | null | undefined};

export const verifyAccountResponseSchema = z.object({
    success : z.boolean().default(false),
    userDetail : selectUserPublicInfoSchema.nullable(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullable()
});
export type VerifyAccountResponse = z.infer<typeof verifyAccountResponseSchema>;

export const loginResponseSchema = z.object({
    success : z.boolean().default(false),
    userDetail : selectUserPublicInfoSchema.nullable(),
    activationToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullable(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullable(),
    condition : z.enum(['loggedIn', 'needVerify'])
});
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

type LoginState = 'loggedIn' | 'needVerify';
type ConditionalLoginResponse<C extends LoginState> = C extends 'loggedIn' 
? Omit<LoginResponseSchema, 'activationToken' | 'condition'> : Omit<LoginResponseSchema, 'condition' | 'userDetail' | 'accessToken'>

export type LoginResponse<C extends LoginState> = ConditionalLoginResponse<C> & {condition : C};

export const socialAuthResponseSchema = z.object({
    success : z.boolean().default(false),
    userDetail : selectUserPublicInfoSchema.nullable(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullable()
});
export type SocialAuthResponse = z.infer<typeof socialAuthResponseSchema>;

export const basicResponseSchema = z.object({
    success : z.boolean().default(false),
    message : z.string().min(1)
});
export type BasicResponse = z.infer<typeof basicResponseSchema>;

export const refreshTokenResponseSchema = z.object({
    success : z.boolean(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullable()
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export { selectUserPublicInfoSchema } from '../models/schema';