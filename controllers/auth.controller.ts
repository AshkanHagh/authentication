import type { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import sendEmail from '../utils/sendMail';
import jwt, { type Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ErrorHandler from '../utils/errorHandler';
import { CatchAsyncError } from '../middlewares/catchAsyncError';
import { createActivationToken } from '../utils/verifyCode';
import { validateLogin, validateSignup } from '../validation/user.validation';
import type { ILoginBody, IRegisterBody, IUserModel, IVerifyCode } from '../types';

export const register = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { fullName, email, password, confirmPassword, gender } = req.body as IRegisterBody;

        const { error, value } = validateSignup(req.body);
        if(error) return next(new ErrorHandler(error.message, 400));

        const isEmailExists = await User.findOne({email});
        if(isEmailExists) return next(new ErrorHandler('Email already exists', 400));

        if(password !== confirmPassword) return next(new ErrorHandler('Password not match', 400));

        const user : IRegisterBody = {
            fullName, email, password, gender
        }

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        await sendEmail({email : user.email, subject : 'Activate your account', text : 'Please Past the blow code to active your account', html : `
        Activation Code is ${activationCode}
        `});

        res.status(200).json({message : 'Please check your email', activationToken : activationToken.token});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const verify = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { activationCode, activationToken } = req.body as IVerifyCode;

        const newUser : {user : IUserModel; activationCode : string} = jwt.verify(activationToken, process.env.JWT_SECRET as Secret) as 
        {user : IUserModel, activationCode : string};

        if(newUser.activationCode !== activationCode) return next(new ErrorHandler('Invalid activation code', 400));

        const { fullName, email, password, gender } = newUser.user;

        const existsUser = await User.findOne({email});
        if(existsUser) return next(new ErrorHandler('Email already exists', 400));

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
	    
        const user = await User.create({
            fullName, email,
            password : hashedPassword,
            gender
        });

        res.status(201).json({_id : user._id, fullName, email});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const login = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { email, password } = req.body as ILoginBody;

        const { error, value } = validateLogin(req.body);
        if(error) return next(new ErrorHandler(error.message, 400));

        const user : IUserModel | null = await User.findOne({email});
        const isPassword = await bcrypt.compare(password, user!.password);
        
        if(!user || !isPassword) return next(new ErrorHandler('Invalid email or password', 400));

        const token = jwt.sign({user}, process.env.JWT_SECRET as Secret, { expiresIn : '15d' });

        user.password = '';

        res.status(200).json({user, token});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
