import ErrorHandler from '../utils/errorHandler';
import type { PublicUserInfo } from '../types';
import type { UpdateProfileSchema } from '../schemas';
import { hset } from '../database/cache';
import { updateUserDetail, type ProfileDetail } from '../database/queries';
import { uploadImage } from '../utils';

export const updateProfileService = async (userDetail : PublicUserInfo, {firstName, image, lastName} : UpdateProfileSchema) : 
Promise<ProfileDetail> => {
    try {
        const updatedImage : string | null = image ? userDetail.image ? await uploadImage(image, userDetail.image) 
        : await uploadImage(image) : userDetail.image
        const updatedName : string = `${firstName || userDetail.name?.split(' ')[0]} ${lastName || userDetail.name?.split(' ')[1]}`;
        
        const [updatedUserDetail] = await Promise.all([updateUserDetail(userDetail.id, {image : updatedImage, name : updatedName}),
            hset(`user:${userDetail.email}`, {image : updatedImage, name : updatedName}), 
            hset(`user:${userDetail.id}`, {image : updatedImage, name : updatedName})
        ]);
        return updatedUserDetail;
        
    } catch (err : unknown) {
        const error = err as ErrorHandler;
        throw new ErrorHandler(`An error ocurred : ${error.message}`, error.statusCode);
    }
}