import { Router } from "express";
import {
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userForgotPasswordValidation,
  userLoginValidation,
  userRegisterValidation,
} from "../validaters/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// unsecured routes for registration and login

router
  .route("/register")
  .post(userRegisterValidation(), validate, registerUser);

router
  .route("/login").post(userLoginValidation(), validate, login);

router
  .route("/verify-email/:verificationToken")
  .get(verifyEmail);

router
  .route("/refresh-Token")
  .post(refreshAccessToken);

router
  .route("/forgot-password")
  .post(userForgotPasswordValidation(), validate, forgotPasswordRequest);

router
  .route("/reset-password/:resetToken")
  .post(resetPasswordValidation(), validate, resetPassword);

// Secure route for logout, requires valid JWT token
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, userChangePasswordValidation(), validate, changeCurrentPassword);

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
