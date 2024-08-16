import { z } from 'zod';

export type UserModel = {
    name : string; email : string; password : string; createdAt : Date; updatedAt : Date;
}

export const registerSchema = z.object({
    email : z.string().email({message : 'Invalid email address'}),
    password : z.string().min(6, {message : 'Password must be 6 or more characters long'})
});

export type RegisterSchema = z.infer<typeof registerSchema>;