import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: folder,
    });
    console.log('File uploaded on Cloudinary. File src is: ', +response.url);

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {

  try {
    if (!publicId) {
      return null;
    }
    const response = await cloudinary.uploader.destroy(publicId);
    return response;

  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return null;
  }
};


export { uploadOnCloudinary, deleteFromCloudinary };
export default uploadOnCloudinary;
