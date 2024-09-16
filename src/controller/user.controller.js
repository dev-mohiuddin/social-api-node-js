import httpError from "../utils/httpError.js";
import fs from 'fs';
import httpResponse from '../utils/httpResponse.js'
import { cloudinary } from '../config/cloudinaryConfig.js'
import { isValidMongoId } from "../service/utils/helper.js";
import userError from "../utils/userError.js";
import { User } from "../model/user.model.js";

// get user by id
export const getUserbyId = async (req, res, next) => {

    try {
        const { id } = req.params;
        const isValid = isValidMongoId(id);
        if (!isValid) return userError(req, res, 400, 'Invalid user id');

        const user = await User.findById(id);
        if (!user) return userError(req, res, 404, 'User not found');

        return httpResponse(req, res, 200, user, 'User get successfully');

    } catch (error) {
        httpError(next, error, req, 500);
    }
}

// getAllusers
export const getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find();

        const resMessage = users?.length === 0 ? 'User not found' : 'User found successfully';

        return httpResponse(req, res, 200, users, resMessage);

    } catch (error) {
        httpError(next, error, req, 500);
    }
}

// update user 
export const profileUpdate = async (req, res, next) => {

    try {
        const myId = req.user._id;
        const { name, bio } = req.body;
        let profilePictureUrl = null;
        let coverPictureUrl = null;

        if (!name) return userError(req, res, 400, 'Please provide Name');

        // Find the user in the database
        const user = await User.findById(myId);
        if (!user) return userError(req, res, 404, 'User not found');

        // Profile Picture upload
        if (req.files && req.files.profilePicture) {

            if (user.profilePicture && user.profilePicture.publicId) {
                await cloudinary.uploader.destroy(user.profilePicture.publicId);
            }
            const profilePicUpload = await cloudinary.uploader.upload(req.files.profilePicture[0].path);
            profilePictureUrl = {
                url: profilePicUpload.secure_url,
                publicId: profilePicUpload.public_id,
            };
        }

        // Cover Photo upload
        if (req.files && req.files.coverPicture) {

            if (user.coverPicture && user.coverPicture.publicId) {
                await cloudinary.uploader.destroy(user.coverPicture.publicId);
            }
            const coverPicUpload = await cloudinary.uploader.upload(req.files.coverPicture[0].path);
            coverPictureUrl = {
                url: coverPicUpload.secure_url,
                publicId: coverPicUpload.public_id,
            };
        }

        // Update user's information
        if (name) user.name = name;
        if (profilePictureUrl) user.profilePicture = profilePictureUrl; // Use new profile picture URL
        if (coverPictureUrl) user.coverPicture = coverPictureUrl; // Use new cover photo URL
        if (bio) user.bio = bio;

        const updatedUser = await user.save();

        return httpResponse(req, res, 200, updatedUser, 'User updated successfully');
    } catch (error) {
        // Handle any errors
        httpError(next, error, req, 500);
    }
}

// Follow user by id
export const followUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const myId = req.user._id;

        const isValid = isValidMongoId(id);
        if (!isValid) return userError(req, res, 400, 'Invalid user id');

        const user = await User.findById(id);
        if (!user) return userError(req, res, 404, 'User not found');

        if (myId.toString() === id) return userError(req, res, 403, 'You cannot follow yourself');

        if (user.followers.includes(myId)) return userError(req, res, 403, 'You are already following this user');

        user.followers.push(myId);
        await user.save();

        const me = await User.findById(myId);
        me.following.push(id);
        await me.save();

        return httpResponse(req, res, 200, user, 'User followed successfully');

    } catch (error) {
        httpError(next, error, req, 500);
    }
}

// Unfollow user by id
export const unFollowUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const myId = req.user._id;

        const isValid = isValidMongoId(id);
        if (!isValid) return userError(req, res, 400, 'Invalid user id');

        const user = await User.findById(id);
        if (!user) return userError(req, res, 404, 'User not found');

        if (myId.toString() === id) return userError(req, res, 403, 'You cannot unfollow yourself');

        if (!user.followers.includes(myId)) return userError(req, res, 403, 'You are not following this user');
        user.followers = user.followers.filter(follower => follower.toString() !== myId.toString());
        await user.save();

        const me = await User.findById(myId);
        me.following = me.following.filter(following => following.toString() !== id);
        await me.save();

        return httpResponse(req, res, 200, user, 'User unfollowed successfully');

    } catch (error) {
        httpError(next, error, req, 500);
    }
}

// get suggested followers to follow 
export const suggestedFollowersToAdd = async (req, res, next) => {
    try {
        const myId = req.user._id;

        const myFollowing = await User.findById(myId).select('following -_id'),
            myFollowers = await User.findById(myId).
                select('followers -_id'),
            myFollowingIds = myFollowing.following.map(following => following.toString()),
            myFollowersIds = myFollowers.followers.map(follower => follower.toString());

        const users = await User.find({
            $and: [
                { _id: { $nin: [...myFollowingIds, ...myFollowersIds, myId] } },
                { followers: { $nin: myId } }
            ]
        });
        const resMessage = users?.length === 0 ? 'Suggested followers not found' : 'Suggested followers found successfully';
        return httpResponse(req, res, 200, users, resMessage);

    } catch (error) {
        httpError(next, error, req, 500);
    }

}

// get following users
export const getFollowingUsers = async (req, res, next) => {
    try {
        const myId = req.user._id;

        const myFollowing = await User.findById(myId).select('following -_id'),
            myFollowingIds = myFollowing.following.map(following => following.toString());

        const users = await User.find({ _id: { $in: myFollowingIds } });
        const resMessage = users?.length === 0 ? 'Following users not found' : 'Following users found successfully';

        return httpResponse(req, res, 200, users, resMessage);

    } catch (error) {
        httpError(next, error, req, 500);
    }
}

