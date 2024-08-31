import httpError from '../utils/httpError.js';
import httpResponse from '../utils/httpResponse.js'
import userError from '../utils/userError.js';
import { cloudinary } from '../config/cloudinaryConfig.js'
import { Post } from '../model/post.model.js';
import { isValidMongoId } from '../service/utils/helper.js';

// Create a post
export const createPost = async (req, res, next) => {
    try {
        const { caption, feeling } = req.body;
        const user = req.user;
        const image = req.file;

        if ( !(caption || image || feeling) ) {
            return userError(req, res, 400, 'Caption or image is required');
        }

        let uploadedImage;
        if (image) {
            const res = await cloudinary.uploader.upload(image.path);
            uploadedImage = res
        }

        const post = new Post({
            author: user._id,
            caption,
            image: {
                publicId: uploadedImage?.public_id,
                url: uploadedImage?.secure_url,
            },
            feeling,
        });
        const newPost = await post.save();

        if (!newPost) return userError(req, res, 400, 'Post could not be created');

        return httpResponse(req, res, 201, newPost, 'Post created successfully');
    } catch (error) {
        console.log(error);
        httpError(next, error, req);
    }
};

// Get all posts
export const getPosts = async (req, res, next) => {
    try {

        const posts = await Post.find().populate('author', 'name profilePicture').exec();

        const resMessage = posts.length === 0 ? 'No posts found' : 'Posts retrieved successfully';

        return httpResponse(req, res, 200, posts, resMessage);

    } catch (error) {
        httpError(next, error, req);
    }
};

// Get all posts of following users
export const getFollowingPosts = async (req, res, next) => {
    try {
        const user = req.user;

        const posts = await Post.find({ author: { $in: user.following } }).populate('author', 'name profilePicture').exec();

        const resMessage = posts.length === 0 ? 'No posts found' : 'Posts retrieved successfully';

        return httpResponse(req, res, 200, posts, resMessage);

    } catch (error) {
        httpError(next, error, req);
    }
};

// Get all post by user id
export const getPostsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if(!isValidMongoId(userId)) return userError(req, res, 400, 'Invalid user id');

        const posts = await Post.find({ author: userId }).populate('author', 'name profilePicture').exec();

        const resMessage = posts.length === 0 ? 'No posts found' : 'Posts retrieved successfully';

        return httpResponse(req, res, 200, posts, resMessage);

    } catch (error) {
        httpError(next, error, req);
    }
}

// Update post by id
export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { caption, feeling } = req.body;

        if(!isValidMongoId(postId)) return userError(req, res, 400, 'Invalid post id');

        const post = await Post.findById(postId);

        if (!post) return userError(req, res, 404, 'Post not found');

        if(post.author.toString() !== req.user._id.toString()) {
            return userError(req, res, 403, 'You are not authorized to update this post');
        }

        if( !(caption || feeling ) ) return userError(req, res, 400, 'Caption or feeling is required');

        post.caption = caption || post.caption;
        post.feeling = feeling || post.feeling;

        const updatedPost = await post.save();

        return httpResponse(req, res, 200, updatedPost, 'Post updated successfully');

    } catch (error) {
        httpError(next, error, req);
    }
};

// Like a post by id
export const likePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const user = req.user;

        if(!isValidMongoId(postId)) return userError(req, res, 400, 'Invalid post id');

        const post = await Post.findById(postId);

        if (!post) return userError(req, res, 404, 'Post not found');

        if (post.likes.includes(user._id)) {
            return userError(req, res, 400, 'Post already liked');
        }

        post.likes.push(user._id);

        const updatedPost = await post.save();

        return httpResponse(req, res, 200, updatedPost, 'Post liked successfully');

    } catch (error) {
        httpError(next, error, req);
    }
}

// Unlike a post by id
export const unlikePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const user = req.user;

        if(!isValidMongoId(postId)) return userError(req, res, 400, 'Invalid post id');

        const post = await Post.findById(postId);

        if (!post) return userError(req, res, 404, 'Post not found');

        if (!post.likes.includes(user._id)) {
            return userError(req, res, 400, 'Post was not liked');
        }

        post.likes = post.likes.filter(like => like.toString() !== user._id.toString());

        const updatedPost = await post.save();

        return httpResponse(req, res, 200, updatedPost, 'Post unliked successfully');

    } catch (error) {
        httpError(next, error, req);
    }
}


