import { Schema, model } from 'mongoose';
import type { IUserModel } from '../types';

const UserSchema = new Schema<IUserModel>({
    fullName : {
        type : String,
        required : [true, 'Please enter your fullName']
    },
    email : {
        type : String,
        required : [true, 'Please enter your email'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'Please enter your password'],
        minlength : [6, 'Password must be more than 6 characters']
    },
    profilePic : {
        type : String,
        default : ''
    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        required : [true, 'Please enter your sex']
    }

}, {timestamps : true});

const User = model<IUserModel>('User', UserSchema);

export default User;