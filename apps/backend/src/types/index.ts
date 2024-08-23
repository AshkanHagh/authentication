import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { questionOptionsTable, questionsTable, userTable } from '../models/schema';

export type ValidationSource = 'json' | 'param' | 'query' | 'parseBody';
export type ValidationDataFuncs<T> = {
    [K in ValidationSource]? : T
}

declare module 'hono' {
    interface HonoRequest {
        validationData : ValidationDataFuncs<unknown>
    }
}

export type SelectUser = InferSelectModel<typeof userTable>;
export type PublicUserInfo = Omit<SelectUser, 'password'>;

export type ActivationLink = {
    activationToken : string; magicLink : string
};
export type ActivationCode = {
    activationToken : string; activationCode : string
};

export type VerifyActivationCodeToken = {
    activationCode : string; user : Pick<SelectUser, 'email' | 'password'>;
}

export type InsertQuestion = InferInsertModel<typeof questionsTable>;
export type SelectQuestion = InferSelectModel<typeof questionsTable>;

export type InsertQuestionOption = InferInsertModel<typeof questionOptionsTable>;
export type selectQuestionOption = InferSelectModel<typeof questionOptionsTable>;

export type InsertState = 'withOption' | 'withoutOption';
export type InsertResponse<S>= S extends 'withOption' ? InsertQuestionTransaction : SelectQuestion;


export type InsertQuestionTransaction = {
    questionDetail : SelectQuestion; questionOptionDetail : selectQuestionOption[]
}