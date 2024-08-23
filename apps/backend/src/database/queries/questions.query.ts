import type { InsertQuestion, InsertQuestionOption, InsertQuestionTransaction, InsertResponse, InsertState, SelectQuestion, 
    selectQuestionOption 
} from '../../types';
import { db } from '../index.db';
import { questionOptionsTable, questionsTable } from '../../models/schema';
import { hset } from '../cache';
import { insertQuestionOptionCache } from '../cache/question.cache';

export const insertQuestion = async (questionDetail : InsertQuestion, trx = db) : Promise<SelectQuestion> => {
    const newQuestionDetail : SelectQuestion = (await trx.insert(questionsTable).values(questionDetail).returning())[0];
    await hset(`question:${newQuestionDetail.id}`, newQuestionDetail, 1209600);
    return newQuestionDetail;
}

export const insertQuestionOptions = async (questionOption : InsertQuestionOption[], trx = db) : Promise<selectQuestionOption[]> => {
    return await trx.insert(questionOptionsTable).values(questionOption).returning();
}

export const handleInsertQuestion = async <S extends InsertState>(questionDetail : InsertQuestion, state : S, 
questionOption? : Pick<InsertQuestionOption, 'option'>[]) : Promise<InsertResponse<S>> => {
    
    const insertQuestionWithOption = async (questionDetailB : InsertQuestion, questionOptionB : InsertQuestionOption[]) : 
    Promise<InsertQuestionTransaction> => {
        return await db.transaction(async trx => {
            const questionDetail : SelectQuestion = await insertQuestion(questionDetailB, trx);
            const questionOptionDetail : selectQuestionOption[] = await insertQuestionOptions(
                questionOptionB.map(option => ({...option, questionId : questionDetail.id})), trx
            );
            await Promise.all([insertQuestionOptionCache('question_options', questionOptionDetail),
                hset(`question:${questionDetail.id}`, questionDetail, 1209600),
            ]);
            return {questionDetail, questionOptionDetail} as InsertQuestionTransaction;
        });
    }
    const handelState : Record<InsertState, (questionDetail : InsertQuestion, questionOption? : Pick<InsertQuestionOption, 'option'>[]) => Promise<InsertResponse<S>>> = {
        // @ts-expect-error // type
        withOption : insertQuestionWithOption, withoutOption : insertQuestion
    }
    return await handelState[state](questionDetail, questionOption);
}