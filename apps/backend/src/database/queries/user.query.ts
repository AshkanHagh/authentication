import { eq } from 'drizzle-orm';
import type { PublicUserInfo, SelectRole, SelectUser, SelectUserRole } from '../../types';
import { db } from '../index.db';
import { roleTable, userRoleTable, userTable } from '../../models/schema';
import { cacheEvent } from '../../events/cache.event';
import ErrorHandler from '../../utils/errorHandler';
import { sadd } from '../cache';

type EmailSearchCondition = 'full' | 'modified';
export type DetailCondition<C, P> = P extends 'modified' ? C extends 'modified' ? Pick<SelectUser, 'email'> 
: PublicUserInfo : SelectUser & Pick<PublicUserInfo, 'roles' | 'permissions'>;
type ConditionResult<C, P> = C extends 'modified' ? Pick<SelectUser, 'email'> : DetailCondition<C, P>;

export const emailSearchWithCondition = async <C extends 'full' | 'modified', P extends 'modified' | 'full'>
(email : string, condition : C, detailCondition : P) : Promise<ConditionResult<C, P> | undefined> => {
    
    const selectEmailOnly = async (email : string) : Promise<ConditionResult<C, P>> => {
        return (await db.select({email : userTable.email}).from(userTable)
        .where(eq(userTable.email, email)))[0] as ConditionResult<C, P>;
    }
    const selectUserDetail = async (email : string, detailCondition? : P) : Promise<ConditionResult<C, P> | undefined> => {
        const columns = detailCondition === 'full' ? undefined : {password : false};
        const userDetail = await db.query.userTable.findFirst({where : (table, {eq}) => eq(table.email, email), columns, 
            with : {roles : {columns : {}, with : {role : {
                columns : {name : true}, with : {permissions : {columns : {permission : true}}}}
            }}
        }});
        const extractUserRoleAndPermission = () : ConditionResult<C, P> => {
            const extractUserRoleAndPermission : Pick<PublicUserInfo, 'permissions' | 'roles'> = (userDetail?.roles.map(role => {
                type RoleDetail = {name : string; permissions : {permission : string}[]} | null
                const roleDetail : RoleDetail = role.role
                
                if(!roleDetail) throw new ErrorHandler(`Error in extracting user role and permission`);
                return {roles : [roleDetail.name], permissions : roleDetail?.permissions.map(({permission}) => permission)};
            }))![0];
    
            const { roles, ...rest } = userDetail!;
            return {...rest, roles : extractUserRoleAndPermission.roles, permissions : extractUserRoleAndPermission.permissions
            } as ConditionResult<C, P>;
        }

        return userDetail ? extractUserRoleAndPermission() : userDetail;
    }

    const handelCondition : Record<EmailSearchCondition, (email : string, condition? : P) => Promise<
    ConditionResult<C, P> | undefined>> = {
        full : selectUserDetail, modified : selectEmailOnly
    }
    return await handelCondition[condition](email, detailCondition);
}
// 1. add redis here
type HandleRoleResponse<C> = C extends 'modified' ? string : SelectRole;
export const handleNewUserRoles = async <C extends 'modified' | 'full'>(userId : string, condition : C) : Promise<HandleRoleResponse<C>> => {
    const basicRoleDetail : SelectRole = (await db.select().from(roleTable).where(eq(roleTable.name, 'basic')))[0];
    if(!basicRoleDetail) {
        const [basicRoleDetail] : [SelectRole] = await Promise.all([
            await db.transaction(async trx => {
                const basicRoleDetail : SelectRole = (await trx.insert(roleTable).values({name : 'basic'}).returning())[0];
                await sadd(`roles`, basicRoleDetail.name, 30 * 24 * 60 * 60 * 1000);
                
                await trx.insert(userRoleTable).values({roleId : basicRoleDetail.id, userId});
                return basicRoleDetail
            })
        ])
        return condition === 'modified' ? basicRoleDetail.name as HandleRoleResponse<C> : basicRoleDetail as HandleRoleResponse<C>;
    }
    await db.insert(userRoleTable).values({roleId : basicRoleDetail.id, userId});
    return condition === 'modified' ? basicRoleDetail.name as HandleRoleResponse<C> : basicRoleDetail as HandleRoleResponse<C>;
}

type InsertDetail<C> = C extends 'social' ? Pick<SelectUser, 'email' | 'name' | 'image'> 
: Pick<SelectUser, 'email' | 'name' | 'password'>

export const insertUserDetail = async <C extends 'emailPassword' | 'social'>(userDetail : InsertDetail<C>) 
: Promise<PublicUserInfo> => {
    const {password, ...rest} = (await db.insert(userTable).values(userDetail).returning())[0];
    const name = await handleNewUserRoles(rest.id, 'modified');
    return {...rest, roles : [name], permissions : []};
}

export type ProfileDetail = Pick<SelectUser, 'image' | 'name'>;
export const updateUserDetail = async (currentUserId : string, updatedValues : ProfileDetail) : Promise<ProfileDetail> => {
    const updatedDetail : SelectUser[] = await db.update(userTable).set({...updatedValues})
    .where(eq(userTable.id, currentUserId)).returning();
    return updatedDetail.map(user => ({name : user.name, image : user.image})).filter(Boolean)[0];
};