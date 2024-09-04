import { z } from 'zod';

export const registerSchema = z.object({
    name : z.string({message : 'Name is required'}).min(1).regex(/^[a-zA-Z\s]+$/, {message : 'Name can only contain letters and spaces'}),
    email : z.string().email({message : 'Invalid email address'}).regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    password : z.string().min(6, {message : 'Password must be 6 or more characters long'})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, { 
        message : 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    })
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const emailCheckSchema = z.object({
    email : z.string().email({message : 'Invalid email address'}).regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
});
export type EmailCheckSchema = z.infer<typeof emailCheckSchema>;

export const loginSchema = z.object({
    email : z.string().email({message : 'Invalid email address'}).regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    password : z.string().min(6, {message : 'Password must be 6 or more characters long'})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, { 
        message : 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    })
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const cookieOptionSchema = z.object({
    expires : z.date(),
    maxAge : z.number().min(1, {message : 'Max age must be a positive number'}),
    httpOnly : z.boolean(),
    sameSite : z.enum(['lax', 'strict', 'none']),
    secure : z.boolean().optional().default(false)
});
export type CookieOption = z.infer<typeof cookieOptionSchema>;

export const verifyMagicLinkToken = z.object({
    token : z.string().trim().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, {message : 'Invalid jwt token format'}),
    condition : z.enum(['existingAccount', 'newAccount']).default('newAccount'),
    code : z.string({message : 'Invalid code signature'}).min(6, {message : 'Code must be at least 6 characters long'}).trim()
    .regex(/^[A-Z0-9]+$/, {message : 'Code must contain only uppercase letters and numbers'}).optional()
});
export type VerifyAccountSchema = z.infer<typeof verifyMagicLinkToken>;

export const socialAuthSchema = z.object({
    name : z.string({message : 'Name is required'}).min(1).regex(/^[a-zA-Z\s]+$/, {message : 'Name can only contain letters and spaces'}),
    image : z.string().url({message : 'Invalid image URL'}),
    email : z.string().email({message : 'Invalid email address'}).regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
});

export type SocialAuth = z.infer<typeof socialAuthSchema>;

export const setRoleSchema = z.object({
    name : z.string({message : 'Name is required'}).min(1).regex(/^[a-zA-Z\s]+$/, {message : 'Name can only contain letters and spaces'}),
    permissions : z.string({message : 'Permissions is required'}).array().min(1),
});
export type SetRoleSchema = z.infer<typeof setRoleSchema>; 