import mongoose, { Schema } from "mongoose";
import bycryt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
  avatar: {
    type: {
      url: String,
      localPath: String,
    },
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    },
    password: {
    type: String,
    required: [true, "Password is required"],   
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshTokens:
    {
      type: String,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationTokenExpiry: {
        type: Date,
    },
}, {
  timestamps: true,

});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
   this.password = await bycryt.hash(this.password, 10)
        next();

    });

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await bycryt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        userId: this._id,
        email: this.email,
        username: this.username,

      },
       process.env.ACCESS_TOKEN_SECRET, 
       { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
    );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        userId: this._id,
        email: this.email,
        username: this.username,

      },
       process.env.REFRESH_TOKEN_SECRET,
       { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN}
    );
}

userSchema.methods.generateTemporaryToken = function (type){
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  const tokenExpiry = Date.now() + 10 * 60 * 1000;
  return { unHashedToken, hashedToken, tokenExpiry };
}

export const User = mongoose.model("User", userSchema);
