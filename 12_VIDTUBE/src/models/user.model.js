import mongoose, { Schema} from "mongoose";

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

export const User = mongoose.model("User", userSchema)