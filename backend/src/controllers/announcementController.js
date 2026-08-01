/**
 * @file announcementController.js
 * @description Platform Announcements Controller
 */

const Announcement = require('../models/Announcement');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @route   GET /api/v1/announcements
 * @route   GET /api/announcements
 * @access  Private — All authenticated users
 */
const getAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find()
        .populate('createdBy', 'fullName role department email')
        .sort('-isPinned -createdAt');

    sendSuccess(res, 200, 'Announcements retrieved successfully.', announcements);
});

/**
 * @route   POST /api/v1/announcements
 * @route   POST /api/announcements
 * @access  Private — Faculty and Admin
 */
const createAnnouncement = asyncHandler(async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return sendError(res, 403, 'Only Faculty and Admin can create announcements.');
    }

    const { title, content, category, targetRole, isPinned } = req.body;

    if (!title || !title.trim()) return sendError(res, 400, 'Title is required.');
    if (!content || !content.trim()) return sendError(res, 400, 'Content is required.');

    const newAnnouncement = await Announcement.create({
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
        targetRole: targetRole || 'all',
        isPinned: Boolean(isPinned),
        createdBy: req.user._id,
    });

    const populated = await Announcement.findById(newAnnouncement._id)
        .populate('createdBy', 'fullName role department email');

    sendSuccess(res, 201, 'Announcement posted successfully.', populated);
});

/**
 * @route   DELETE /api/v1/announcements/:id
 * @access  Private — Faculty and Admin
 */
const deleteAnnouncement = asyncHandler(async (req, res) => {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return sendError(res, 403, 'Only Faculty and Admin can delete announcements.');
    }

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
        return sendError(res, 404, 'Announcement not found.');
    }

    await Announcement.findByIdAndDelete(req.params.id);

    sendSuccess(res, 200, 'Announcement deleted successfully.', { id: req.params.id });
});

module.exports = {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
};
