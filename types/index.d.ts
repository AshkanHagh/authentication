import { Document } from 'mongoose';

export type IError = {
    statusCode : Number
    message : string
    name? : string
    path? : string
    keyValue? : any
}

export interface IUserModel extends Document {
    fullName : string
    email : string
    password : string
    profilePic : string
    gender : string
}

export interface IRegisterBody {
    fullName : string
    email : string
    password : string
    confirmPassword? : string
    gender : string
}

export interface ILoginBody {
    email : string
    password : string
}

export interface IVerifyCode {
    activationCode : string
    activationToken : string
}

export interface IActivationCode {
    token : string
    activationCode : string
}