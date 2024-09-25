import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: null
        },

        messageCount: {
            type: Number,
            default: 0
        },

        isGroupChat: {
            type: Boolean,
            default: false
        },

        groupName: {
            type: String,
            default: null
        },

        groupImage: {
            publicId: {
                type: String,
                default: '',
            },
            url: {
                type: String,
                default: '',
            },
        },
        creator: { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

    },
    { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;