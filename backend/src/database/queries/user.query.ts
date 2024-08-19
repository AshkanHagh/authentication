import { eq } from 'drizzle-orm';
import type { PublicUserInfo, SelectUser } from '../../types/index.type';
import { db } from '../index.db';
import { userTable } from '../schema';

type Condition = 'full' | 'modified';
type DetailCondition<C, P> = P extends 'modified' ? C extends 'modified' ? Pick<SelectUser, 'email'> : PublicUserInfo : SelectUser;
type ConditionResult<C, P> = C extends 'modified' ? Pick<SelectUser, 'email'> : DetailCondition<C, P>;

export const emailSearchWithCondition = async <C extends 'full' | 'modified', P extends 'modified' | 'full'>(
email : string, condition : C, detailCondition : P) : Promise<ConditionResult<C, P>> => {
    const selectEmailOnly = async (email : string) : Promise<ConditionResult<C, P>> => {
        return (await db.select({email : userTable.email}).from(userTable).where(eq(userTable.email, email)))[0] as ConditionResult<C, P>;
    }
    const selectUserDetail = async (email : string, detailCondition? : P) : Promise<ConditionResult<C, P>> => {
        const columns = detailCondition === 'full' ? undefined : {password : false};
        return await db.query.userTable.findFirst({where : (table, {eq}) => eq(table.email, email), columns}) as ConditionResult<C, P>
    }

    const handelCondition : Record<Condition, (email : string, condition? : P) => Promise<ConditionResult<C, P>>> = {
        full : selectUserDetail, modified : selectEmailOnly
    }
    return await handelCondition[condition](email, detailCondition);
}

export const insertUserDetail = async (email : string, pass : string, name : string) : Promise<PublicUserInfo> => {
    const {password, ...rest} = (await db.insert(userTable).values({email, password : pass, name}).returning())[0];
    return rest;
}