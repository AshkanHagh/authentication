import jwt from 'jsonwebtoken';
import type { ActivationCode, ActivationLink, SelectUser } from '../types';

export const generateActivationLink = (user : Partial<SelectUser>) : ActivationLink => {
    const activationToken : string = jwt.sign(user, process.env.ACTIVATION_TOKEN, {expiresIn : '5m'});
    return {activationToken, magicLink : `${process.env.API_BASEURL}/api/auth/verify?token=${activationToken}`};
}

export const verifyActivationToken = <T>(activationToken : string) : T => {
    return jwt.verify(activationToken, process.env.ACTIVATION_TOKEN) as T
}

export const generateActivationCode = (user : Partial<SelectUser>) : ActivationCode => {
    const activationCode : string = Math.floor(1000 + Math.random() * 9000).toString();
    const activationToken : string = jwt.sign({activationCode, user}, process.env.ACTIVATION_TOKEN, {expiresIn : '5m'});
    return {activationCode, activationToken};
}