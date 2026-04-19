import { body } from "express-validator";

const userRegisterValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLowercase()
      .withMessage("Password must be in lowercase")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 2 })
      .withMessage("Username must be at least 2 characters long"),
  ];
};

const userLoginValidation = () => {
  return [
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Invalid email format"),
    body("username")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Username must be at least 2 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPassword = () => {
  return [
    body("currentPassword")
      .trim()
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLowercase()
      .withMessage("New password must be in lowercase")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ];
};

const userForgotPasswordValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
  ];
};

const userResetForgotPasswordValidation = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLowercase()
      .withMessage("New password must be in lowercase")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ];
};


export { userRegisterValidation, userLoginValidation, userChangeCurrentPassword, userForgotPasswordValidation, userResetForgotPasswordValidation };
