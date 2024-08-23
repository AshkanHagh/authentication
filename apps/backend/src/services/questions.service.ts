import { handleInsertQuestion } from '../database/queries';
import ErrorHandler from '../utils/errorHandler';
import type { InsertQuestion, InsertQuestionOption, InsertResponse, InsertState } from '../types';
import type { AddQuestionSchema } from '../schemas/zod.schemas';
import { uploadImageUrl } from '../utils';

export const addQuestionService = async ({answer, question, image, options} : AddQuestionSchema) : Promise<InsertResponse<InsertState>> => {
    try {
        const questionDetailObj : InsertQuestion = {answer, question, image : image ? await uploadImageUrl(image) : null};
        const modifiedOptionsDetail : Pick<InsertQuestionOption, 'option'>[] | undefined = options ? Object.entries(options).map(
            data => ({option : data[1]})
        ) : undefined;

        const state : InsertState = modifiedOptionsDetail && modifiedOptionsDetail.length > 0 ? 'withOption' : 'withoutOption';
        return await handleInsertQuestion(questionDetailObj, state, modifiedOptionsDetail);
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error ocurred : ${error.message}`, error.statusCode);
    }
}