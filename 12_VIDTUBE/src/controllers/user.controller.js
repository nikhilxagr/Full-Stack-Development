import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // validation

  if (
    fullName?.trim() === '' ||
    email?.trim() === '' ||
    username?.trim() === '' ||
    password?.trim() === ''
  ) {
    throw new ApiError('All fields are required', 400);
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError('User with this email or username already exists', 400);
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath || !coverLocalPath) {
    throw new ApiError('Avatar and cover photo are required', 400);
  }

  let avatar;
  let coverPhoto = null;

  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    coverPhoto = await uploadOnCloudinary(coverLocalPath);
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
    coverPhoto: coverPhoto?.url || ' ',
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverPhoto: coverPhoto?.url || ' ',
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  try {
    if (!createdUser) {
      throw new ApiError('User registration failed', 500);
    }
  } catch (error) {
    console.error('Error occurred while creating user:', error);
    throw new ApiError('User registration failed', 500);
  }

  if(avatar && avatar.public_id) {
    await deleteFromCloudinary(avatar.public_id);
  }
  if(coverPhoto && coverPhoto.public_id) {
    await deleteFromCloudinary(coverPhoto.public_id);
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: createdUser,
  });
});

export { registerUser };