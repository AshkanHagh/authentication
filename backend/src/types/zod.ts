import { z } from 'zod';

export const registerSchema = z.object({
    email : z.string().email({ message : 'Invalid email address' }),
    password : z.string().min(6, { message : 'Password must be 6 or more characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, { 
        message : 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    })
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const cookieOptionSchema = z.object({
    expires : z.date(),
    maxAge : z.number().min(1, { message : 'Max age must be a positive number' }),
    httpOnly : z.boolean(),
    sameSite : z.enum(['lax', 'strict', 'none']),
    secure : z.boolean().optional().default(false)
});

export type CookieOption = z.infer<typeof cookieOptionSchema>;

export const magicLinkSchema = z.object({
    token : z.string().trim(),
    condition : z.enum(['existingAccount', 'newAccount']).default('existingAccount'),
    code : z.string().trim().optional() 
});