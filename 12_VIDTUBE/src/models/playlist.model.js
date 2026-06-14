import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video',
                required: true,
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);  

export default mongoose.model('Playlist', playlistSchema);