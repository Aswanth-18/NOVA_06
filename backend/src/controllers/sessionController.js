/**
 * @file sessionController.js
 * @description Session & Messages Module Controller.
 * Handles messaging between students and verified mentors with accepted bookings.
 */

const User = require('../models/User');
const Session = require('../models/Session');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
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

    // Auto-create missing conversations for any existing accepted/completed bookings
    const acceptedSessions = await Session.find({
        status: { $in: ['accepted', 'completed'] },
        $or: [{ student: userId }, { mentor: userId }]
    });

    for (const session of acceptedSessions) {
        const existingConv = await Conversation.findOne({ bookingId: session._id });
        if (!existingConv) {
            await Conversation.create({
                bookingId: session._id,
                mentorId: session.mentor,
                userId: session.student,
                lastMessage: 'Conversation started',
                lastMessageAt: new Date()
            });
        }
    }

    const userConversations = await Conversation.find({
        $or: [{ userId: userId }, { mentorId: userId }]
    }).populate({
        path: 'bookingId',
        populate: [
            { path: 'student', select: 'fullName registerNumber department email role profileImage isVerifiedMentor' },
            { path: 'mentor', select: 'fullName registerNumber department email role profileImage isVerifiedMentor' }
        ]
    }).sort('-lastMessageAt');

    const conversations = [];

    for (const conv of userConversations) {
        if (!conv.bookingId) continue;
        const session = conv.bookingId;
        
        // Exclude if pending, rejected, cancelled
        if (['pending', 'rejected', 'cancelled'].includes(session.status)) {
            continue;
        }

        const isUserStudent = session.student._id.toString() === userId.toString();
        const partner = isUserStudent ? session.mentor : session.student;

        if (!partner) continue;

        // Count unread messages
        const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            receiver: userId,
            isRead: false,
        });

        conversations.push({
            _id: conv._id,
            conversationId: conv._id,
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
            lastMessage: conv.lastMessage,
            lastMessageTime: conv.lastMessageAt,
            unreadCount,
            isOnline: true,
            status: session.status,
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

    let conv = await Conversation.findOne({
        $or: [{ bookingId: conversationId }, { _id: conversationId }]
    }).populate('bookingId');

    if (!conv) {
        conv = await Conversation.findOne({
            $or: [
                { userId: userId, mentorId: conversationId },
                { mentorId: userId, userId: conversationId }
            ]
        }).populate('bookingId');
    }

    if (!conv || !conv.bookingId) {
        return sendError(res, 403, 'A student and mentor can only chat after a booking request has been accepted.');
    }

    const session = conv.bookingId;
    if (['pending', 'rejected', 'cancelled'].includes(session.status)) {
         return sendError(res, 403, 'Chat is disabled for this booking status.');
    }

    // Automatically mark incoming messages as read
    await Message.updateMany(
        { conversationId: conv._id, receiver: userId, isRead: false },
        { isRead: true }
    );

    const messages = await Message.find({ conversationId: conv._id })
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

    if (receiverId && receiverId.toString() === senderId.toString()) {
        return sendError(res, 400, 'Users cannot send messages to themselves.');
    }

    let conv = await Conversation.findOne({ bookingId }).populate('bookingId');
    
    if (!conv && receiverId) {
        conv = await Conversation.findOne({
            $or: [
                { userId: senderId, mentorId: receiverId },
                { mentorId: senderId, userId: receiverId }
            ]
        }).populate('bookingId');
    }

    if (!conv || !conv.bookingId) {
        const session = await Session.findOne({
            _id: bookingId,
            status: 'accepted',
            $or: [{ student: senderId }, { mentor: senderId }]
        });
        if (session) {
             conv = await Conversation.create({
                bookingId: session._id,
                mentorId: session.mentor,
                userId: session.student,
                lastMessage: 'Conversation started',
                lastMessageAt: new Date()
            });
            conv.bookingId = session;
        } else {
            return sendError(res, 403, 'Users cannot send messages unless they have an accepted booking.');
        }
    }

    const session = conv.bookingId;
    
    if (session.status !== 'accepted' && session.status !== 'completed') {
        return sendError(res, 403, 'Cannot send messages for this booking status.');
    }
    
    if (session.status === 'completed') {
        return sendError(res, 403, 'This session is completed. Chat is read-only.');
    }

    const actualReceiverId = receiverId || (session.student.toString() === senderId.toString() ? session.mentor : session.student);

    const newMessage = await Message.create({
        sender: senderId,
        receiver: actualReceiverId,
        conversationId: conv._id,
        message: message.trim(),
        messageType: messageType || 'text',
        isRead: false,
    });
    
    conv.lastMessage = message.trim();
    conv.lastMessageAt = new Date();
    await conv.save();

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
