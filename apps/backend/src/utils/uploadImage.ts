import { v2 as cloudinary, UploadStream, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary';

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