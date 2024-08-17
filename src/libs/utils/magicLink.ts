import jwt from 'jsonwebtoken';
import type { ActivationLink, UserModel } from '../../types/index.type';

export const generateActivationLink = (user : Partial<UserModel>) : ActivationLink => {
    const activationToken : string = jwt.sign(user, process.env.ACTIVATION_TOKEN, {expiresIn : '5m'});
    return `${process.env.API_BASEURL}/api/auth/verify?token=${activationToken}`;
}

export const verifyActivationToken = (activationToken : string) : ActivationLink => {
    const verifiedToken = jwt.verify(activationToken, process.env.ACTIVATION_TOKEN) as ActivationLink;
    return verifiedToken;
}