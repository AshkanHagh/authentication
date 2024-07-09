import Joi from 'joi';

const validator = (schema : Joi.Schema) => (payload : object) => schema.validate(payload, {abortEarly : false});

const signupSchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
});

export const validateSignup = validator(signupSchema);

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
});

export const validateLogin = validator(loginSchema);

const socialAuthSchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    avatar : Joi.string()
});

export const validateSocialAuth = validator(socialAuthSchema);