import type { Document } from 'mongoose';
import type { Request } from 'express';

export type IError = {
    statusCode : Number
    message : string
}

export interface IUserModel extends Document {
    _doc? : any
    name : string
    email : string
    password : string
    avatar : {
        public_id : string
        url : string
    }
    role : string
    isVerified : boolean
    comparePassword : (password : string) => Promise<boolean>
    SignAccessToken : () => string
    SignRefreshToken : () => string
}

declare global {
    namespace Express {
        interface Request {
            user? : IUserModel
        }
    }
}

export interface IRegisterBody {
    name : string
    email : string
    password : string
    avatar? : string
}

export interface ILoginRequest {
    email : string
    password : string
}

export interface IActivationToken {
    token : string
    activationCode : string
}

export interface IActivationRequest {
    activationToken : string
    activationCode : string
}

export interface ITokenOptions {
    expires : Date
    maxAge : number
    httpOnly : boolean
    sameSite : 'lax' | 'strict' | 'none' | undefined
    secure? : boolean
}

export interface ISocialBody {
    name : string
    email : string
    avatar : string
}