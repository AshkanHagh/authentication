import redis from '../../configs/redis.config';
import type { selectQuestionOption } from '../../types';

export const insertQuestionOptionCache = async (hashKey : string, optionsDetail : selectQuestionOption[]) : Promise<void> => {
    const pipeline = redis.pipeline();
    optionsDetail.forEach(option => {
        pipeline.hmset(`${hashKey}:${option.id}`, option);
        pipeline.expire(hashKey, 1209600);
    });
    (await pipeline.exec())?.map(data => data[1]);
}