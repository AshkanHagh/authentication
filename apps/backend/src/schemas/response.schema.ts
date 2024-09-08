import { z } from 'zod';
import { selectUserPublicInfoSchema, selectUserSchema } from '../models/schema';

export type MakeKeysRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type nullish<T> = {[P in keyof T]: T[P] | null | undefined};

export const basicUserIncludedResponse = z.object({
    success : z.boolean().default(false),
    userDetail : selectUserPublicInfoSchema.nullish(),
});
export type BasicUserIncludedResponse = z.infer<typeof basicUserIncludedResponse>;

export const verifyAccountResponseSchema = z.object({
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullish()
}).merge(basicUserIncludedResponse);
export type VerifyAccountResponse = z.infer<typeof verifyAccountResponseSchema>;

export const loginResponseSchema = z.object({
    activationToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullish(),
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullish(),
    state : z.enum(['loggedIn', 'needVerify'])
}).merge(basicUserIncludedResponse);;
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

type ConditionalLoginResponse<S> = S extends 'loggedIn' ? Omit<
    LoginResponseSchema, 'activationToken' | 'condition'
> : Pick<LoginResponseSchema, 'accessToken'>;
export type LoginResponse<C extends 'loggedIn' | 'needVerify'> = ConditionalLoginResponse<C> & {condition : C};

export const socialAuthResponseSchema = z.object({
    accessToken : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 
        {message : 'Invalid jwt token format'}
    ).nullish()
}).merge(basicUserIncludedResponse);
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
    ).nullish()
});
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export const usersResponseSchema = z.object({
    success : z.boolean().default(false),
    users : z.array(selectUserSchema.omit({role : true}).extend({role : z.array(z.string())}))
});
export type UsersResponseSchema = z.infer<typeof usersResponseSchema>;

export { selectUserPublicInfoSchema } from '../models/schema';