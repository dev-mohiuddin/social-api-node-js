import httpError from '../utils/httpError.js';
import httpResponse from '../utils/httpResponse.js'
import userError from '../utils/userError.js';
import { isValidMongoId } from '../service/utils/helper.js';
import Message from '../model/messege.model.js'
import Conversation from '../model/conversation.model.js';

// Create a Messages
export const createMessage = async (req, res, next) => {
    try {
        const conversationId = req.params.conversationId;
        if (!isValidMongoId(conversationId)) return userError(req, res, 400, 'Invalid conversation id');

        const { receiver, content, media } = req.body;
        const sender = req.user?._id; // Assuming the sender's ID is stored in the authenticated user

        // Validate input
        if (!receiver || !conversationId) return userError(req, res, 400, 'Receiver and conversation ID are required');
        if (sender.toString() === receiver.toString()) return userError(req, res, 400, 'You cannot send a message to yourself');

        if (!content && !media) return userError(req, res, 400, 'Either content or media must be provided');
        

        if (!isValidMongoId(receiver)) return userError(req, res, 400, 'Invalid receiver id');
        if (!isValidMongoId(conversationId)) return userError(req, res, 400, 'Invalid conversation id');

        // check conversation exists
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return userError(req, res, 404, 'Conversation not found');

        // Create a new message
        const newMessage = new Message({
            sender,
            receiver,
            content,
            media,
            conversationId,
        });

        // Save the message to the database
        await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
            $inc: { messageCount: 1 }
        },
        );

        return httpResponse(req, res, 201, newMessage, 'Message created successfully');
    } catch (error) {
        process.env.ENV === 'development' && console.log(error);
        httpError(next, error, req);
    }
};

export const getMessagesByConversationId = async (req, res, next) => {
    try {
        const conversationId = req.params.conversationId;

        if (!isValidMongoId(conversationId)) return userError(req, res, 400, 'Invalid conversation id');

        // Find all messages in the conversation
        const messages = await Message.find({ conversationId })
            .populate('sender', 'name profilePicture')
            .populate('receiver', 'name profilePicture')
            .sort({ createdAt: 1 });

        return httpResponse(req, res, 200, messages, 'Messages retrieved successfully');
    } catch (error) {
        process.env.ENV === 'development' && console.log(error);
        httpError(next, error, req);
    }
}


