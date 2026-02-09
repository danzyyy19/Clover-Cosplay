import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ Cloudinary environment variables are missing!");
    console.error("Please check your .env file for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDER = 'cosplay';

export async function uploadImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: CLOUDINARY_FOLDER,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url || '');
            }
        ).end(buffer);
    });
}

export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

export function getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `${CLOUDINARY_FOLDER}/${filename.split('.')[0]}`;
    return publicId;
}

export default cloudinary;
