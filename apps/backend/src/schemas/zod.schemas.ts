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
    code : z.string({message : 'Invalid code signature'}).min(4).trim().regex(/^\d{4}$/).optional()
});
export type VerifyAccountSchema = z.infer<typeof verifyMagicLinkToken>;

export const socialAuthSchema = z.object({
    name : z.string({message : 'Name is required'}).min(1).regex(/^[a-zA-Z\s]+$/, {message : 'Name can only contain letters and spaces'}),
    image : z.string().url({message : 'Invalid image URL'}),
    email : z.string().email({message : 'Invalid email address'}).regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
});

export type SocialAuth = z.infer<typeof socialAuthSchema>;

export const updateProfileSchema = z.object({
    firstName : z.string().min(1).regex(/^[a-zA-Z\s]+$/, {message : 'FirstName can only contain letters and spaces'}).optional(),
    lastName : z.string().min(1).regex(/^[a-zA-Z\s]+$/, {message : 'LastName can only contain letters and spaces'}).optional(),
    image : z.instanceof(File).optional()
}).refine(data => data.firstName || data.lastName || data.image, {
    message : 'At least one field (firstName, lastName, or image) must be provided'
});
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

const questionOptionSchema = z.object({
    option1 : z.string().min(1, {message : 'Option 1 must be at least 1 character long'}).optional(),
    option2 : z.string().min(1, {message : 'Option 2 must be at least 1 character long'}).optional(),
    option3 : z.string().min(1, {message : 'Option 3 must be at least 1 character long'}).optional(),
    option4 : z.string().min(1, {message : 'Option 4 must be at least 1 character long'}).optional(),
    correctAnswer : z.string()
}).refine(data => {
    const option = [data.option1, data.option2, data.option3, data.option4].filter(Boolean);
    return option.includes(data.correctAnswer);
}, {message: 'correctAnswer must be one of the provided options'}).optional();
export type QuestionOptions = z.infer<typeof questionOptionSchema>;

export const addQuestionSchema = z.object({
    question : z.string().min(1, {message : 'Question must be at least 1 character long'}),
    image : z.string().url().optional(),
    options : questionOptionSchema.refine(data => data?.option1 || data?.option2 || data?.option3 || data?.option4, {
        message : 'At least one field (option) must be provided'
    }),
    answer : z.string().min(1, {message : 'Answer must be at least 1 character long'})
});
export type AddQuestionSchema = z.infer<typeof addQuestionSchema>;