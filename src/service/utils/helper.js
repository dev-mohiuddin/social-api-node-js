import { isValidObjectId } from "mongoose";
import sharp from 'sharp';

// mongoose isValidObjectId function
export const isValidMongoId = (id) => {
    return isValidObjectId(id);
};

// compress image using sharp
export const compressImage = async (imageBuffer) => {
    try {
        const compressedImageBuffer = await sharp(imageBuffer)
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        return compressedImageBuffer;
    } catch (error) {
        return error;
    }
};
