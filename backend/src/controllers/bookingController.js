/**
 * @file bookingController.js
 * @description Session Booking Controller — handles CRUD operations, validations, role
 * restrictions, and status updates.
 *
 * Per-Skill Mentor Verification:
 *  - createBooking verifies that the mentor has an APPROVED MentorSkill record for the
 *    specific skillName being booked. A global isVerifiedMentor flag is NOT sufficient.
 *  - Users acting as mentors (accepting/rejecting/completing) are those with bookings
 *    where they are the 'mentor' field — no role change is needed.
 */

const Session = require('../models/Session');
const User = require('../models/User');
const MentorSkill = require('../models/MentorSkill');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { addXP } = require('./leaderboardController');

/**
 * @route   POST /api/v1/bookings
 * @access  Private — User only (Faculty & Admin cannot create bookings)
 * @desc    Create a new mentoring session booking request.
 *          Validates that the mentor has an APPROVED MentorSkill for the requested skill.
 */
const createBooking = asyncHandler(async (req, res) => {
    // Faculty & Admin cannot create bookings
    if (req.user.role === 'faculty' || req.user.role === 'admin') {
        return sendError(res, 403, 'Faculty and Admin members cannot create session bookings.');
    }

    const { mentorId, skillName, scheduledDate, scheduledTime, topic, notes } = req.body;

    // Validate required fields
    if (!mentorId) return sendError(res, 400, 'Mentor ID is required.');
    if (!skillName || !skillName.trim()) return sendError(res, 400, 'Skill name is required.');
    if (!scheduledDate) return sendError(res, 400, 'Scheduled date is required.');
    if (!scheduledTime || !scheduledTime.trim()) return sendError(res, 400, 'Scheduled time slot is required.');
    if (!topic || !topic.trim()) return sendError(res, 400, 'Session topic or doubt is required.');

    // 1. Validate: Past Date check
    const bookingDate = new Date(scheduledDate);
    if (isNaN(bookingDate.getTime())) {
        return sendError(res, 400, 'Invalid scheduled date format.');
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const bookingDateOnly = new Date(bookingDate);
    bookingDateOnly.setHours(0, 0, 0, 0);

    if (bookingDateOnly < startOfToday) {
        return sendError(res, 400, 'Booking cannot be created for a past date.');
    }

    // 2. Validate: Mentor user must exist
    const mentorUser = await User.findById(mentorId);
    if (!mentorUser) {
        return sendError(res, 404, 'Mentor user not found.');
    }

    // 3. Prevent booking yourself
    if (mentorUser._id.toString() === req.user._id.toString()) {
        return sendError(res, 400, 'You cannot book a mentoring session with yourself.');
    }

    // 4. CORE: Per-skill mentor verification
    //    The mentor must have an APPROVED MentorSkill record for this exact skill.
    const approvedSkill = await MentorSkill.findOne({
        userId: mentorId,
        skillName: { $regex: new RegExp(`^${skillName.trim()}$`, 'i') },
        status: 'approved',
    });

    if (!approvedSkill) {
        return sendError(
            res,
            400,
            `${mentorUser.fullName} is not a verified mentor for "${skillName}". Only approved mentors can receive bookings for that skill.`
        );
    }

    // 5. Validate: Prevent duplicate bookings for the same mentor, date, and time slot
    const duplicateBooking = await Session.findOne({
        mentor: mentorId,
        scheduledDate: bookingDateOnly,
        scheduledTime: scheduledTime.trim(),
        status: { $in: ['pending', 'accepted'] }
    });

    if (duplicateBooking) {
        return sendError(res, 409, 'A booking request already exists for this mentor at the selected date and time slot.');
    }

    // Create session booking
    const newSession = await Session.create({
        student: req.user._id,
        mentor: mentorId,
        skillName: skillName.trim(),
        scheduledDate: bookingDateOnly,
        scheduledTime: scheduledTime.trim(),
        topic: topic.trim(),
        notes: notes ? notes.trim() : '',
        status: 'pending',
    });

    // Auto-award XP (+20 XP for student booking request)
    await addXP(req.user._id, 20);

    const populatedSession = await Session.findById(newSession._id)
        .populate('student', 'fullName registerNumber department email year')
        .populate('mentor', 'fullName registerNumber department email year isVerifiedMentor');

    sendSuccess(res, 201, 'Session booking request submitted successfully. Status: Pending', populatedSession);
});

/**
 * @route   GET /api/v1/bookings
 * @access  Private — All authenticated roles
 * @desc    Get bookings list. Filtering based on role and query params.
 */
const getBookings = asyncHandler(async (req, res) => {
    const filter = {};

    // Filter per role
    if (req.user.role === 'user') {
        if (req.query.type === 'teaching') {
            filter.mentor = req.user._id;
        } else if (req.query.type === 'learning') {
            filter.student = req.user._id;
        } else {
            filter.$or = [{ student: req.user._id }, { mentor: req.user._id }];
        }
    } else {
        // Faculty & Admin: view all bookings, support filters by mentor, department, status
        if (req.query.mentor) {
            filter.mentor = req.query.mentor;
        }
    }

    if (req.query.status && req.query.status !== 'All') {
        filter.status = req.query.status.toLowerCase();
    }

    let sessions = await Session.find(filter)
        .populate('student', 'fullName registerNumber department email year')
        .populate('mentor', 'fullName registerNumber department email year isVerifiedMentor')
        .sort('-createdAt');

    // Faculty/Admin filter by department if specified
    if (req.query.department && req.query.department !== 'All Departments') {
        sessions = sessions.filter(s =>
            s.mentor?.department === req.query.department || s.student?.department === req.query.department
        );
    }

    sendSuccess(res, 200, 'Bookings retrieved successfully.', sessions);
});

/**
 * @route   GET /api/v1/bookings/:id
 * @access  Private — All authorized roles
 * @desc    Get details of a single booking by ID.
 */
const getBookingById = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id)
        .populate('student', 'fullName registerNumber department email year')
        .populate('mentor', 'fullName registerNumber department email year isVerifiedMentor');

    if (!session) {
        return sendError(res, 404, 'Booking session not found.');
    }

    // Verify ownership for user
    if (req.user.role === 'user') {
        const isStudent = session.student._id.toString() === req.user._id.toString();
        const isMentor = session.mentor._id.toString() === req.user._id.toString();
        if (!isStudent && !isMentor) {
            return sendError(res, 403, 'Access denied. You can only view your own sessions.');
        }
    }

    sendSuccess(res, 200, 'Booking details retrieved successfully.', session);
});

/**
 * @route   PUT /api/v1/bookings/:id/status
 * @route   PUT /api/v1/bookings/:id
 * @access  Private — User (Cancel pending as learner; Accept/Reject/Complete as mentor), Admin
 * @desc    Update booking status.
 *          Users acting as "mentor" in a session can accept/reject/complete.
 *          Per-skill approval is already verified at booking creation time.
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason, action } = req.body;

    const targetStatus = (status || action || '').toLowerCase();
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if (!targetStatus || !validStatuses.includes(targetStatus)) {
        return sendError(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}.`);
    }

    const session = await Session.findById(id);
    if (!session) {
        return sendError(res, 404, 'Booking session not found.');
    }

    const isStudent = session.student.toString() === req.user._id.toString();
    const isMentor = session.mentor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Role-based status rules
    if (isStudent && !isAdmin && !isMentor) {
        // Learners can ONLY cancel Pending bookings
        if (targetStatus !== 'cancelled') {
            return sendError(res, 403, 'Students can only cancel their booking requests.');
        }
        if (session.status !== 'pending') {
            return sendError(res, 400, 'Only pending bookings can be cancelled by students.');
        }
    } else if (isMentor && !isAdmin) {
        // Mentors can accept, reject, or complete
        if (!['accepted', 'rejected', 'completed'].includes(targetStatus)) {
            return sendError(res, 403, 'Mentors can only accept, reject, or mark sessions as completed.');
        }
    }

    // Apply status change
    const previousStatus = session.status;
    session.status = targetStatus;
    session.reviewedAt = new Date();

    if (targetStatus === 'rejected' && rejectionReason) {
        session.rejectionReason = rejectionReason.trim();
    }

    await session.save();

    // Auto-award XP when session is marked as completed
    if (targetStatus === 'completed' && previousStatus !== 'completed') {
        await addXP(session.student, 50);   // Learner earns +50 XP
        await addXP(session.mentor, 100);   // Teaching mentor earns +100 XP

        // Increment completed session counts
        await User.findByIdAndUpdate(session.student, { $inc: { completedSessionsCount: 1 } });
        await User.findByIdAndUpdate(session.mentor, { $inc: { completedSessionsCount: 1 } });
    }

    const updatedSession = await Session.findById(id)
        .populate('student', 'fullName registerNumber department email year')
        .populate('mentor', 'fullName registerNumber department email year isVerifiedMentor');

    sendSuccess(res, 200, `Booking status updated to ${targetStatus} successfully.`, updatedSession);
});

/**
 * @route   DELETE /api/v1/bookings/:id
 * @access  Private — User, Admin
 * @desc    Delete a booking session document.
 */
const deleteBooking = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);
    if (!session) {
        return sendError(res, 404, 'Booking session not found.');
    }

    await Session.findByIdAndDelete(req.params.id);

    sendSuccess(res, 200, 'Booking session deleted successfully.', { id: req.params.id });
});

module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
};
