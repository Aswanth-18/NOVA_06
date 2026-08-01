/**
 * @file Session.js
 * @description Mongoose Session / Booking model for SkillSync.
 * Represents a session booking between a student and a verified mentor.
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student reference is required.'],
        },
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Mentor reference is required.'],
        },
        skillName: {
            type: String,
            required: [true, 'Skill name is required.'],
            trim: true,
        },
        scheduledDate: {
            type: Date,
            required: [true, 'Scheduled date is required.'],
        },
        scheduledTime: {
            type: String,
            required: [true, 'Scheduled time slot is required.'],
            trim: true,
        },
        topic: {
            type: String,
            required: [true, 'Session topic or doubt description is required.'],
            trim: true,
        },
        notes: {
            type: String,
            default: '',
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
            default: 'pending',
        },
        rejectionReason: {
            type: String,
            default: '',
            trim: true,
        },
        reviewedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate bookings for the same mentor, date, and time slot
sessionSchema.index({ mentor: 1, scheduledDate: 1, scheduledTime: 1 });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

module.exports = Session;
