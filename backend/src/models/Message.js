/**
 * @file Message.js
 * @description Mongoose Message model for SkillSync chat.
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender reference is required.'],
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Receiver reference is required.'],
        },
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: [true, 'Conversation reference is required.'],
        },
        message: {
            type: String,
            required: [true, 'Message text is required.'],
            trim: true,
        },
        messageType: {
            type: String,
            enum: ['text', 'image', 'file', 'system', 'emoji'],
            default: 'text',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index to quickly fetch messages for a specific conversation
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, isRead: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;
