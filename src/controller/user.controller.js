import httpError from "../utils/httpError.js";
import httpResponse from '../utils/httpResponse.js'
import { isValidMongoId } from "../service/utils/helper.js";
import userError from "../utils/userError.js";
import { User } from "../model/user.model.js";


export const getUserbyId = async(req, res, next) => {

    try {
        const {id} = req.params;
        const isValid = isValidMongoId(id);
        if (!isValid) return userError(req, res, 400, 'Invalid user id');

        const user = await User.findById(id);
        if (!user) return userError(req, res, 404, 'User not found');

        return httpResponse(req, res, 200, user, 'User get successfully');
        
    } catch (error) {
        httpError(next, error, req, 500);
    }
}

export const userUpdateById = async(req, res, next) =>{

    try {
        const {id} = req.params;
        const myId = req.user._id;
        const {name, profilePicture, bio, gender} = req.body;

        const isValid = isValidMongoId(id);
        if (!isValid) return userError(req, res, 400, 'Invalid user id');

        const user = await User.findById(id);
        if (!user) return userError(req, res, 404, 'User not found');

        if (myId.toString() !== id) return userError(req, res, 403, 'You are not allowed to update this user');
        
        if(name) user.name = name;
        if(profilePicture) user.profilePicture = profilePicture;
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;

        const updatedUser = await user.save();

        return httpResponse(req, res, 200, updatedUser, 'User updated successfully');

    } catch (error) {
        httpError(next, error, req, 500);
    }
}

// Follow user by id
export const followUser = async(req, res, next) => {
    try {
        const {id} = req.params;
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
export const unFollowUser = async(req, res, next) => {
    try {
        const {id} = req.params;
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