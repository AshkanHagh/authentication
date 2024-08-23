import { z } from 'zod';
import { selectUserPublicInfoSchema } from '../models/schema';

export const registerResponseSchema = z.object({
    success : z.boolean(),
    activationToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    )
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const verifyAccountResponseSchema = z.object({
    success : z.boolean(),
    userDetail : selectUserPublicInfoSchema,
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    )
});
export type verifyAccountResponse = z.infer<typeof verifyAccountResponseSchema>;

export const emailCheckResponseSchema = z.object({
    success : z.boolean(),
    message : z.string().optional(),
    name : z.string().optional()
});
export type EmailCheckSchema = z.infer<typeof emailCheckResponseSchema>;
type EnforcePresence<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type EmailCheckResponseError = EnforcePresence<EmailCheckSchema, 'message'> & {success : false};
export type EmailCheckResponseTrue = EnforcePresence<EmailCheckSchema, 'name'> & {success : true};

export type EmailCheckResponse = (EmailCheckResponseError | EmailCheckResponseTrue);

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
export type LoginResponse = z.infer<typeof loginResponseSchema>;

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