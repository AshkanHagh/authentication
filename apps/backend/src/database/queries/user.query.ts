import { eq } from 'drizzle-orm';
import type { PublicUserInfo, SelectUser, SelectUserWithPermission } from '../../types';
import { db } from '../index.db';
import { userTable } from '../../models/schema';
import { findRolePermission } from '../cache/user.cache';
import { dashboardEvent } from '../../events';

export type SelectDetailByColumn<Condition, Column> = Column extends 'password' ? Condition extends 'email' ? Pick<SelectUser, 'email'> 
: SelectUserWithPermission : SelectUser & Pick<SelectUserWithPermission, 'permissions'>;
export type UserSearchResult<C, P> = C extends 'email' ? Pick<SelectUser, 'email'> : SelectDetailByColumn<C, P>;
type UserResultBaseOnColumn<Column> = Column extends 'password' ? {user : PublicUserInfo} : {user : SelectUser};

type PickUserDetail = 'email' | 'full';
type OmitUserColumns = 'password' | 'none';
export const searchUsersByEmail = async <Condition extends PickUserDetail, Columns extends OmitUserColumns>
(email : string, selectCondition : Condition, omitColumn : Columns) : Promise<UserSearchResult<Condition, Columns> | null> => {
    const selectUserWithEmailColumn = async (email : string) : Promise<UserSearchResult<Condition, Columns>> => {
        return (await db.select({email : userTable.email}).from(userTable).where(eq(userTable.email, email)))[0] as UserSearchResult<Condition, Columns>;
    }

    const selectUserWithOmittedColumns = async (email : string, omitColumn? : Columns) 
    : Promise<UserSearchResult<Condition, Columns> | null> => {
        const { password, ...columns } = userTable;
        const omittedColumn = omitColumn === 'none' ? userTable : columns;

        const userWithRoleDetail : UserResultBaseOnColumn<Columns> = (await db.select({user : omittedColumn}).from(userTable)
        .where(eq(userTable.email, email)))[0];
        if(userWithRoleDetail) {
            const rolePermissions : string[] = await findRolePermission(userWithRoleDetail.user.role!);
            return {...userWithRoleDetail.user, permissions : rolePermissions} as UserSearchResult<Condition, Columns>;
        }
        return null;
    }

    const handelCondition : Record<PickUserDetail, (email : string, omitColumn? : Columns) => Promise<
    UserSearchResult<Condition, Columns> | null>> = {
        full : selectUserWithOmittedColumns, email : selectUserWithEmailColumn
    }
    return await handelCondition[selectCondition](email, omitColumn);
}

type InsertDetail<C> = C extends 'social' ? Pick<SelectUser, 'email' | 'name' | 'image'> : Pick<SelectUser, 'email' | 'name' | 'password'>
export const insertUserDetail = async <C extends 'emailPassword' | 'social'>(userDetail : InsertDetail<C>) 
: Promise<PublicUserInfo> => {
    const {password, ...rest} = (await db.insert(userTable).values(userDetail).returning())[0];
    dashboardEvent.emit('emitRoleInsert');
    return rest;
}

export type ProfileDetail = Pick<SelectUser, 'image' | 'name'>;
export const updateUserDetail = async (currentUserId : string, updatedValues : ProfileDetail) : Promise<ProfileDetail> => {
    const updatedDetail : SelectUser[] = await db.update(userTable).set({...updatedValues}).where(eq(userTable.id, currentUserId))
    .returning();
    return updatedDetail.map(user => ({name : user.name, image : user.image})).filter(Boolean)[0];
};