import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        select : false,
        validate: {
            validator: function (v) {
                return v.length >= 6;
            },
            message: props => `Password must be at least 6 characters long.`
        }
    },
    profilePicture: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        default: [],
    },
    savedPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
        default: [],
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);