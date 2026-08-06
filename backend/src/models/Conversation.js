/**
 * @file Conversation.js
 * @description Mongoose Conversation model for SkillSync chat.
 */

const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            required: [true, 'Booking reference is required.'],
        },
        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Mentor reference is required.'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required.'],
        },
        lastMessage: {
            type: String,
            default: '',
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({ bookingId: 1 });
conversationSchema.index({ userId: 1, mentorId: 1 });

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
