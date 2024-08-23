import type { Context } from 'hono';
import { CatchAsyncError } from '../utils';
import type { AddQuestionSchema } from '../schemas';
import { addQuestionService } from '../services/questions.service';
import type { InsertResponse, InsertState } from '../types';

export const addQuestion = CatchAsyncError(async (context : Context) => {
    const { question, options, image, answer } = context.req.validationData.json as AddQuestionSchema;
    const questionDetail : InsertResponse<InsertState> = await addQuestionService({answer, question, image, options});
    return context.json({success : true, questionDetail}, 201);
});