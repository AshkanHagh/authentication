import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload, type Secret } from 'jsonwebtoken';
import User from '../models/user.model';
import sendEmail from '../utils/sendMail';
import ErrorHandler from '../utils/errorHandler';
import { CatchAsyncError } from '../middlewares/catchAsyncError';
import { createActivationToken } from '../utils/activationToken';
import { validateLogin, validateSignup, validateSocialAuth } from '../validation/joi';
import { accessTokenOption, refreshTokenOption, sendToken } from '../utils/jwt';
import { redis } from '../db/redis';
import type { IActivationRequest, ILoginRequest, IRegisterBody, ISocialBody, IUserModel } from '../types';

export const register = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { name, email, password } = req.body as IRegisterBody;

        const { error, value } = validateSignup(req.body);
        if(error) return next(new ErrorHandler(error.message, 400));

        const isEmailExists = await User.findOne({email});
        if(isEmailExists) return next(new ErrorHandler('Email already exists', 400));

        const user : IRegisterBody = {
            name, email, password
        }

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        await sendEmail({email : user.email, subject : 'Activate your account', text : 'Please Past the blow code to active your account', html : `
            Activation Code is ${activationCode}
        `});

        res.status(200).json({success : true, message : 'Please check your email', activationToken : activationToken.token});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400)); 
    }
});

export const activateUser = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { activationCode, activationToken } = req.body as IActivationRequest;

        const newUser : {user : IUserModel; activationCode : string} = jwt.verify(activationToken, process.env.ACTIVATION_SECRET as Secret) as
        {user : IUserModel; activationCode : string};

        if(newUser.activationCode !== activationCode) return next(new ErrorHandler('Invalid activation code', 400));

        const { name, email, password } = newUser.user;

        const existsUser = await User.findOne({email}).select('+password');
        if(existsUser) return next(new ErrorHandler('Email already exists', 400));

        const user = await User.create({
            name, email, password
        });

        res.status(201).json({message : 'Account has been created'});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400)); 
    }
});

export const login = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { email, password } = req.body as ILoginRequest;
        
        const { error, value } = validateLogin(req.body);
        if(error) return next(new ErrorHandler(error.message, 400));

        const user = await User.findOne({email}).select('+password');
        const isPasswordMatch = await user!.comparePassword(password);

        if(!user || !isPasswordMatch) return next(new ErrorHandler('Invalid email or password', 400));

        sendToken(user, 200, res);

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const logout = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        res.cookie('access_token', '', {maxAge : 1});
        res.cookie('refresh_token', '', {maxAge : 1});

        const userId = req.user?._id || '';
        redis.del(userId);

        res.status(200).json({message : 'Logged out successfully'});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const updateAccessToken = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const refresh_Token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_Token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        const message = 'Could not refresh token ';
        
        if(!decoded) return next(new ErrorHandler(message, 400));

        const session  = await redis.get(decoded.id as string);
        if(!session) return next(new ErrorHandler(message, 400));

        const user = JSON.parse(session);
        req.user = user;

        const accessToken = jwt.sign({id : user._id}, process.env.ACCESS_TOKEN as string, {expiresIn : '5m'});
        const refreshToken = jwt.sign({id : user._id}, process.env.REFRESH_TOKEN as string, {expiresIn : '7d'});

        res.cookie('access_token', accessToken, accessTokenOption);
        res.cookie('refresh_token', refreshToken, refreshTokenOption);

        res.status(200).json({accessToken});

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const socialAuth = CatchAsyncError(async (req : Request, res : Response, next : NextFunction) => {

    try {
        const { name, email, avatar } = req.body as ISocialBody;

        const { error, value } = validateSocialAuth(req.body);
        if(error) return next(new ErrorHandler(error.message, 400));

        const user = await User.findOne({email});
        if(!user) {
            const newUser = await User.create({
                name, email, avatar
            });
            sendToken(newUser, 200, res);
        }

        sendToken(user!, 200, res);

    } catch (error : any) {
        return next(new ErrorHandler(error.message, 400));
    }
});