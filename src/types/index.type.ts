import { z } from 'zod';

export type UserModel = {
    id : string; name : string; email : string; password : string; createdAt : Date; updatedAt : Date;
}

export const registerSchema = z.object({
    email : z.string().email({message : 'Invalid email address'}),
    password : z.string().min(6, {message : 'Password must be 6 or more characters long'})
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type ActivationLink = string;

export const CookieOptionSchema = z.object({
    expire : z.date(),
    maxAge : z.number(),
    httpOnly : z.boolean(),
    sameSite : z.enum(['lax', 'strict', 'none']),
    secure : z.boolean().optional().default(false)
});

export type CookieOption = z.infer<typeof CookieOptionSchema>;