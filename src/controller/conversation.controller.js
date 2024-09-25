import httpError from '../utils/httpError.js';
import httpResponse from '../utils/httpResponse.js'
import userError from '../utils/userError.js';
import { isValidMongoId } from '../service/utils/helper.js';
import Conversation from '../model/conversation.model.js';
import path from 'path';

// Create a Conversation
export const createConversation = async (req, res, next) => {
    try {
        const creator = req.user?._id;
        const { participants, isGroupChat = false, groupName, groupImage } = req.body;

        if (!participants || !Array.isArray(participants) || participants.length < 2) {
            return userError(req, res, 400, 'Participants are required and must be an array with minimum 2 participants');
        }
        if (!participants.includes(creator.toString())) {
            return userError(req, res, 403, 'Unauthorized: Creator must be a participant');
        }

        // Check if a conversation with the same participants already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: participants }, // Match all participants
            isGroupChat: isGroupChat
        });

        if (existingConversation) {
            return userError(req, res, 400, 'A conversation with the same participants already exists');
        }

        const conversation = new Conversation({
            participants,
            isGroupChat,
            groupName,
            groupImage,
            creator
        });

        await conversation.save();

        return httpResponse(req, res, 201, conversation, 'Conversation created successfully');
    } catch (error) {
        process.env.ENV === 'development' && console.log(error);
        httpError(next, error, req);
    }
};


export const allUserConversations = async (req, res, next) => {
    try {
        const userId = req.user?._id; // Get the user ID from the request

        // Find all conversations where the user is a participant
        const conversations = await Conversation.find({ participants: userId })
            .populate('participants', 'name profilePicture') // Populate participants
            .populate({
                path: 'lastMessage',
                select: 'content sender createdAt', // Select fields from lastMessage
                populate: {
                    path: 'sender', // Nested populate for sender
                    select: 'name'
                }
            })
            .sort({ updatedAt: -1 })
            .exec();

        return httpResponse(req, res, 200, conversations, 'Fetched all conversations successfully');
    } catch (error) {
        process.env.ENV === 'development' && console.log(error);
        httpError(next, error, req);
    }
};

export const getAllConversations = async (req, res, next) => {
    try {

        const conversations = await Conversation.find({})
            .populate('participants', 'name profilePicture') // Populate participants
            .populate({
                path: 'lastMessage',
                select: 'content sender createdAt', // Select fields from lastMessage
                populate: {
                    path: 'sender', // Nested populate for sender
                    select: 'name'
                }
            })
            .sort({ updatedAt: -1 })
            .exec();

        return httpResponse(req, res, 200, conversations, 'Fetched all conversations successfully');

    } catch (error) {
        process.env.ENV === 'development' && console.log(error);
        httpError(next, error, req);
    }
}
