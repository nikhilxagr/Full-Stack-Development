import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new ApiError('Failed to generate tokens', 500);
  }
};

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

  if (avatar && avatar.public_id) {
    await deleteFromCloudinary(avatar.public_id);
  }
  if (coverPhoto && coverPhoto.public_id) {
    await deleteFromCloudinary(coverPhoto.public_id);
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: createdUser,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!email) {
    throw new ApiError('Email is required', 400);
  }


  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

   // validate the password

  const { accessToken, refreshToken } = await          generateAccessAndRefereshToken(
  user._id
  );

const loggedInUser = await User.findById(user._id).select(
  '-password -refreshToken'
);

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

return res
  .status(200)
  .cookie('refreshToken', refreshToken, options)
  .cookie('accessToken', accessToken, options)
  .json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken, refreshToken },
      'User logged in successfully'
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,
    { 
      $set: { 
      refreshToken: undefined,
     }
   },
   { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
  };

  return res
    .status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const inCommingrefreshToken = req.cookies.refreshToken;

  if (!inCommingRefreshToken) {
    throw new ApiError('Refresh token is required', 401);
  }

  try {
    const decoded = jwt.verify(
      inCommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user || user.refreshToken !== inCommingRefreshToken) {
      throw new ApiError('Invalid refresh token', 401);
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefereshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie('refreshToken', newRefreshToken, options)
      .cookie('accessToken', accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new ApiError('Failed to refresh access token', 500);
  }
});

export { registerUser, loginUser, refreshAccessToken , logoutUser};
