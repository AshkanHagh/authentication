import type { Context } from 'hono';
import { CatchAsyncError } from '../utils';
import type { PublicUserInfo } from '../types';
import type { UpdateProfileSchema } from '../schemas';
import { updateProfileService } from '../services/dashboard.service';
import type { ProfileDetail } from '../database/queries';

export const updateProfile = CatchAsyncError(async (context : Context) => {
    const { firstName, lastName, image } = await context.req.validationData.parseBody as UpdateProfileSchema;
    const currentUserDetail : PublicUserInfo = context.get('user') as PublicUserInfo;

    const userDetail : ProfileDetail = await updateProfileService(currentUserDetail, {firstName, lastName, image});
    return context.json({userDetail});
})