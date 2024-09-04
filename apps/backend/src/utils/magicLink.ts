import jwt from 'jsonwebtoken';
import type { ActivationCode, ActivationLink, SelectUser } from '../types';

export const generateActivationLink = (user : Partial<SelectUser>) : ActivationLink => {
    const activationToken : string = jwt.sign(user, process.env.ACTIVATION_TOKEN, {expiresIn : '5m'});
    return {activationToken, magicLink : `${process.env.MAGIC_LINK_BASE_URL}/${process.env.MAGIC_LINK_URL}?token=${activationToken}`};
}

export const verifyActivationToken = <T>(activationToken : string) : T => {
    return jwt.verify(activationToken, process.env.ACTIVATION_TOKEN) as T
}

export const generateActivationCode = <T>(user : T) : ActivationCode => {
    const chars : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let activationCode : string = '';
    for (let i : number = 0; i < 6; i++) {
        activationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const activationToken : string = jwt.sign({activationCode, user}, process.env.ACTIVATION_TOKEN, {expiresIn : '5m'});
    return {activationCode, activationToken};
}