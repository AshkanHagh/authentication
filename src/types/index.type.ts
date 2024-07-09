import type { InferSelectModel } from 'drizzle-orm';
import type { UserTable } from '../database/schema';

export type TErrorHandler = {
    statusCode : number; message : string;
}

export type TInferSelectUser = InferSelectModel<typeof UserTable>
export type TInferSelectUserNoPass = Omit<TInferSelectUser, 'password'>

export type TActivationToken = {
    activationCode : string; activationToken : string;
}

export type TCookieOptions = {
    expires : Date; maxAge : number; httpOnly : boolean; sameSite : 'lax' | 'strict' | 'none' | undefined; secure? : boolean;
}

declare global {
    namespace Express {
        interface Request {user? : TInferSelectUserNoPass;}
    }
}

export type TVerifyActivationToken = {
    user : TInferSelectUser; activationCode : string;
}