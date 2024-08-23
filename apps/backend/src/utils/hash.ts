import { hash, genSalt, compare } from 'bcrypt';

export const hashPassword = async (password : string) : Promise<string> => {
    const salt : string = await genSalt(10);
    return await hash(password, salt);
}

export const comparePassword = async (password : string, oldPassword : string) : Promise<boolean> => {
    return await compare(password, oldPassword);
}