import httpError from "../utils/httpError.js";
import httpResponse from "../utils/httpResponse.js";
import userError from "../utils/userError.js";
import { Comment } from '../model/comment.model.js'
import { isValidMongoId } from "../service/utils/helper.js";

// Create a comment
export const createComment = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const user = req.user;

        if (!isValidMongoId(postId)) return userError(req, res, 400, 'Invalid post id');

        if (!content) return userError(req, res, 400, 'Comment is required');

        const comment = new Comment({
            content,
            postId,
            author: user._id,
        });

        await comment.save();

        return httpResponse(req, res, 201, comment, 'Comment created successfully');

    } catch (error) {
        httpError(next, error, req);
    }
}

// Get comment by post id
export const getCommentsByPostId = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!isValidMongoId(postId)) return userError(req, res, 400, 'Invalid post id');

        const comments = await Comment.find({ postId }).populate('author', 'name profilePicture' ).exec();

        const resMessage = comments.length === 0 ? 'No comments found' : 'Comments retrieved successfully';

        return httpResponse(req, res, 200, comments, resMessage);

    } catch (error) {
        httpError(next, error, req);
    }
}