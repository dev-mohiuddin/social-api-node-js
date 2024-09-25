import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Message Schema
const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String }, // Message text is now optional
        media: {
            type: String, // URL for media (image, video, etc.)
            required: function () {
                return !this.content; // Media is required only if content is not provided
            },
        },
        isRead: { type: Boolean, default: false },
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
