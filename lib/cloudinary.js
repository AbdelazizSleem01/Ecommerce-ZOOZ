import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImages = async (files) => {
  try {
    if (!Array.isArray(files)) {
      files = [files];
    }

    const uploadPromises = files.map(async (file) => {
      // For Node.js Buffer objects
      if (file.buffer) {
        const base64 = file.buffer.toString('base64');
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${base64}`, 
          { folder: 'profile-pictures' }
        );
        return result.secure_url;
      }
      // For File objects from the browser
      else if (file.arrayBuffer) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const result = await cloudinary.uploader.upload(
          `data:${file.type};base64,${base64}`, 
          { folder: 'profile-pictures' }
        );
        return result.secure_url;
      }
      throw new Error('Unsupported file type');
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    throw error;
  }
};