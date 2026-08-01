const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Announcement title is required.'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Announcement content is required.'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['general', 'workshop', 'exam', 'placement', 'contest'],
            default: 'general',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetRole: {
            type: String,
            enum: ['all', 'student', 'mentor', 'faculty'],
            default: 'all',
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
