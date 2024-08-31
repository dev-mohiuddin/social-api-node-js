import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: {
        type: String,
        default: '',
    },
    image: {
        publicId: {
            type: String,
            default: '',
        },
        url: {
            type: String,
            default: '',
        },
    },
    feeling: {
        type: String,
        default: '',
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema)