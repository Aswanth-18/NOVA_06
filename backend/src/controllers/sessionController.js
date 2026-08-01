/**
 * @file sessionController.js
 * @description Session & Messages Module Controller.
 * Handles messaging between students and verified mentors with accepted bookings.
 */

const User = require('../models/User');
const Session = require('../models/Session');
const { Message } = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── Messaging API Handlers ───────────────────────────────────────────────────

/**
 * @route   GET /api/conversations
 * @route   GET /api/v1/conversations
 * @access  Private — Student, Verified Mentor (Faculty & Admin forbidden)
 * @desc    Get all active conversations based on accepted bookings.
 */
const getConversations = asyncHandler(async (req, res) => {
    // Faculty and Admin cannot access messaging
    if (req.user.role === 'faculty' || req.user.role === 'admin') {
        return sendError(res, 403, 'Faculty and Admin members are not allowed to access messaging.');
    }

    const userId = req.user._id;

    // Find all accepted sessions where user is student or mentor
    const acceptedSessions = await Session.find({
        status: 'accepted',
        $or: [{ student: userId }, { mentor: userId }]
    })
        .populate('student', 'fullName registerNumber department email role profileImage isVerifiedMentor')
        .populate('mentor', 'fullName registerNumber department email role profileImage isVerifiedMentor')
        .sort('-updatedAt');

    const conversations = [];

    for (const session of acceptedSessions) {
        const isUserStudent = session.student._id.toString() === userId.toString();
        const partner = isUserStudent ? session.mentor : session.student;

        if (!partner) continue;

        // Fetch latest message for this booking
        const lastMsg = await Message.findOne({ bookingId: session._id })
            .sort('-createdAt');

        // Count unread messages
        const unreadCount = await Message.countDocuments({
            bookingId: session._id,
            receiver: userId,
            isRead: false,
        });

        conversations.push({
            _id: session._id,
            bookingId: session._id,
            partner: {
                _id: partner._id,
                fullName: partner.fullName,
                registerNumber: partner.registerNumber,
                department: partner.department,
                email: partner.email,
                role: partner.role,
                isVerifiedMentor: partner.isVerifiedMentor,
                avatar: partner.profileImage || '',
            },
            skillName: session.skillName,
            scheduledDate: session.scheduledDate,
            scheduledTime: session.scheduledTime,
            lastMessage: lastMsg ? lastMsg.message : 'Session accepted. Start chatting!',
            lastMessageTime: lastMsg ? lastMsg.createdAt : session.updatedAt,
            unreadCount,
            isOnline: true, // UI indicator
        });
    }

    sendSuccess(res, 200, 'Conversations retrieved successfully.', conversations);
});

/**
 * @route   GET /api/messages/:conversationId
 * @route   GET /api/v1/messages/:conversationId
 * @access  Private — Student, Verified Mentor (Faculty & Admin forbidden)
 * @desc    Get all messages for a specific booking conversation and mark them as read.
 */
const getMessagesByConversation = asyncHandler(async (req, res) => {
    if (req.user.role === 'faculty' || req.user.role === 'admin') {
        return sendError(res, 403, 'Faculty and Admin members are not allowed to access messaging.');
    }

    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify session exists and is accepted
    let session = await Session.findOne({
        _id: conversationId,
        status: 'accepted',
        $or: [{ student: userId }, { mentor: userId }]
    });

    // Fallback: search by partner user ID if conversationId is a user ID
    if (!session) {
        session = await Session.findOne({
            status: 'accepted',
            $or: [
                { student: userId, mentor: conversationId },
                { mentor: userId, student: conversationId }
            ]
        }).sort('-updatedAt');
    }

    if (!session) {
        return sendError(res, 403, 'A student and mentor can only chat after a booking request has been accepted.');
    }

    const bookingId = session._id;

    // Automatically mark incoming messages as read
    await Message.updateMany(
        { bookingId, receiver: userId, isRead: false },
        { isRead: true }
    );

    // Fetch messages sorted by createdAt ascending
    const messages = await Message.find({ bookingId })
        .populate('sender', 'fullName email role')
        .populate('receiver', 'fullName email role')
        .sort('createdAt');

    sendSuccess(res, 200, 'Messages retrieved successfully.', messages);
});

/**
 * @route   POST /api/messages
 * @route   POST /api/v1/messages
 * @access  Private — Student, Verified Mentor (Faculty & Admin forbidden)
 * @desc    Send a message within an accepted booking conversation.
 */
const sendMessage = asyncHandler(async (req, res) => {
    if (req.user.role === 'faculty' || req.user.role === 'admin') {
        return sendError(res, 403, 'Faculty and Admin members are not allowed to access messaging.');
    }

    const { receiverId, bookingId, message, messageType = 'text' } = req.body;
    const senderId = req.user._id;

    if (!message || !message.trim()) {
        return sendError(res, 400, 'Message content is required.');
    }

    // 1. Validate: Cannot send message to self
    if (receiverId && receiverId.toString() === senderId.toString()) {
        return sendError(res, 400, 'Users cannot send messages to themselves.');
    }

    // 2. Validate: Must have an accepted booking
    let session = null;
    if (bookingId) {
        session = await Session.findOne({
            _id: bookingId,
            status: 'accepted',
            $or: [{ student: senderId }, { mentor: senderId }]
        });
    }

    if (!session && receiverId) {
        session = await Session.findOne({
            status: 'accepted',
            $or: [
                { student: senderId, mentor: receiverId },
                { mentor: senderId, student: receiverId }
            ]
        }).sort('-updatedAt');
    }

    if (!session) {
        return sendError(res, 403, 'Users cannot send messages unless they have an accepted booking.');
    }

    const actualBookingId = session._id;
    const actualReceiverId = receiverId || (session.student.toString() === senderId.toString() ? session.mentor : session.student);

    const newMessage = await Message.create({
        sender: senderId,
        receiver: actualReceiverId,
        bookingId: actualBookingId,
        message: message.trim(),
        messageType: messageType || 'text',
        isRead: false,
    });

    const populatedMsg = await Message.findById(newMessage._id)
        .populate('sender', 'fullName email role')
        .populate('receiver', 'fullName email role');

    sendSuccess(res, 201, 'Message sent successfully.', populatedMsg);
});

/**
 * @route   PUT /api/messages/read/:id
 * @route   PUT /api/v1/messages/read/:id
 * @access  Private — Student, Mentor
 * @desc    Mark a specific message as read.
 */
const markMessageAsRead = asyncHandler(async (req, res) => {
    if (req.user.role === 'faculty' || req.user.role === 'admin') {
        return sendError(res, 403, 'Faculty and Admin members are not allowed to access messaging.');
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
        return sendError(res, 404, 'Message not found.');
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
        return sendError(res, 403, 'Access denied.');
    }

    message.isRead = true;
    await message.save();

    sendSuccess(res, 200, 'Message marked as read.', message);
});

// ─── Legacy Session Handlers ─────────────────────────────────────────────────
const getAllSessions = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Sessions', []));
const getSessionById = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Session', { id: req.params.id }));
const createSession = asyncHandler(async (req, res) => sendSuccess(res, 201, 'Created'));
const updateSessionStatus = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Updated'));

module.exports = {
    getConversations,
    getMessagesByConversation,
    sendMessage,
    markMessageAsRead,
    getAllSessions,
    getSessionById,
    createSession,
    updateSessionStatus,
};
