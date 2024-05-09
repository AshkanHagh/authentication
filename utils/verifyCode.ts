import jwt, { type Secret } from 'jsonwebtoken';
import type { IActivationCode, IRegisterBody } from '../types';

export const createActivationToken = (user : IRegisterBody ) : IActivationCode => {

    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({user, activationCode}, process.env.JWT_SECRET as Secret, {expiresIn : '5m'});

    return { token, activationCode }
}