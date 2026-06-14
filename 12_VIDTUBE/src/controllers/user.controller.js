import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const  registerUser = asyncHandler(async (req, res) => {
  const {fullName, email, username, password} = req.body;

  // validation

  if (fullname?.trim() === '' || email?.trim() === '' || username?.trim() === '' || password?.trim() === '') {
    throw new ApiError('All fields are required', 400);
  }

 const existingUser = await User.findOne({
    $or: [
        {email},
        {username}
    ]   
 })

 if (existingUser) {
    throw new ApiError('User with this email or username already exists', 400);
 }

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath || !coverLocalPath) {
    throw new ApiError('Avatar and cover photo are required', 400);
}


// const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars');

// let coverPhoto = "";
// if (coverLocalPath) {
//     coverPhoto = await uploadOnCloudinary(coverLocalPath, 'coverPhotos');
// }


let avtar ;
try {
    avtar = await uploadOnCloudinary(avatarLocalPath);
    console.log('uploaded coverPhoto successfully:', coverPhoto?.url);

    let coverPhoto = null;

} catch (error) {
    console.error('Error uploading files to Cloudinary:', error);
    throw new ApiError('Failed to upload files', 500);
}

const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverPhoto: coverPhoto?.url || " "
});

const createdUser = await User.findById(user._id).select("-password -refreshToken");

if (!createdUser) {
    throw new ApiError('User registration failed', 500);
}

res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: createdUser
});

});


export {registerUser}