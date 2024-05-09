import Joi from 'joi';

const validator = (schema : Joi.Schema) => (payload : object) => schema.validate(payload, {abortEarly : false});

const signupSchema = Joi.object({
    fullName : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
    confirmPassword : Joi.ref('password'),
    gender : Joi.string().required()
});

export const validateSignup = validator(signupSchema);

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
});

export const validateLogin = validator(loginSchema);