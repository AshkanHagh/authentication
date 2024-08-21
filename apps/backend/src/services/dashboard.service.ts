import ErrorHandler from '../libs/utils/errorHandler';
import { v2 as cloudinary, UploadStream, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary';
import type { PublicUserInfo, UpdateProfileSchema } from '../types';
import { hset } from '../database/cache';
import { updateUserDetail, type ProfileDetail } from '../database/queries';

export const uploadImage = async (image : File, oldImage? : string) : Promise<string> => {
    const arrayBuffer : ArrayBuffer = await image.arrayBuffer();
    const buffer : Buffer = Buffer.from(arrayBuffer);

    if(oldImage) await cloudinary.uploader.destroy(oldImage.split('/').pop()!.split('.')[0], {resource_type : 'image'})
    return new Promise<string>((resolve, reject) => {
        const uploadStream : UploadStream = cloudinary.uploader.upload_stream({resource_type : 'auto'},
            (error : UploadApiErrorResponse | undefined, response : UploadApiResponse | undefined) => {
                error ? reject(error) : response ? resolve(response.secure_url) : undefined
            }
        )
        uploadStream.end(buffer);
    });
}

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