import { Router } from "express";
import {
  login,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userLoginValidation,
  userRegisterValidation,
} from "../validaters/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(userRegisterValidation(), validate, registerUser);
router.route("/login").post(userLoginValidation(), validate, login);

// Secure route for logout, requires valid JWT token
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
