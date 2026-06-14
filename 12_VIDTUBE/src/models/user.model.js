import mongoose, { Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema (
    {
        username:{
            type: String,
            required: true,
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
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        avtar: {
            type: String,
            default: "https://res.cloudinary.com/dzj8q4l9c/image/upload/v1690794417/default-avatar_foh5nq.png",
            required: false,
        },
        coverImage: {
            type: String,
            default: "https://res.cloudinary.com/dzj8q4l9c/image/upload/v1690794417/default-cover-image_ajh5nq.png",
            required: false,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required:[true, "Password is required"],
        },
    },
    { 
        timestamps: true,
    }

)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    // SHORT-LIVED ACCESS TOKEN
    
    jwt.sign({
        userId: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
    );
}

userSchema.methods.generateRefreshToken = function () {
  // SHORT-LIVED ACCESS TOKEN

  jwt.sign(
    {
      userId: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }

  );
};



export const User = mongoose.model("User", userSchema);