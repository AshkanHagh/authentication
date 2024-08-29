import { z } from 'zod';
import { selectUserPublicInfoSchema } from '../models/schema';

export const registerResponseSchema = z.object({
    success : z.boolean(),
    message : z.string()
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const verifyAccountResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema,
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    )
});
export type VerifyAccountResponse = z.infer<typeof verifyAccountResponseSchema>;

export const emailCheckResponseSchema = z.object({
    success : z.boolean(),
    message : z.string().optional(),
    name : z.string().optional()
});
export type EmailCheckResponseSchema = z.infer<typeof emailCheckResponseSchema>;
type EnforcePresence<T, K extends keyof T> = T & Required<Pick<T, K>>;

type ConditionalEmailCheckResponse<S extends boolean> = S extends true
    ? Omit<EnforcePresence<EmailCheckResponseSchema, 'name'>, 'message'> & { success: true }
    : Omit<EnforcePresence<EmailCheckResponseSchema, 'message'>, 'name'> & { success: false };

export type EmailCheckResponse<R extends boolean = boolean> = R extends true ? ConditionalEmailCheckResponse<true>
    : R extends false ? ConditionalEmailCheckResponse<false> : ConditionalEmailCheckResponse<true> | ConditionalEmailCheckResponse<false>;

export const loginResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema.optional(),
    activationToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).optional(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).optional()
});
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

type ConditionalLoginResponse<S extends boolean> = S extends true
    ? Omit<EnforcePresence<LoginResponseSchema, 'userDetail' | 'accessToken'>, 'activationToken' | 'success'>
    : Omit<EnforcePresence<LoginResponseSchema, 'activationToken'>, 'userDetail' | 'accessToken' | 'success'> & {success : false};

export type LoginResponse<R extends boolean = boolean> = R extends true ? ConditionalLoginResponse<true> & {success : true}
    : ConditionalLoginResponse<false>;

export const socialAuthResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema.optional(),
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