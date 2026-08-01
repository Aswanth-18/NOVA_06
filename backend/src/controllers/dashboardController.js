/**
 * @file dashboardController.js
 * @description Serves dynamic, aggregated dashboard data for all roles using MongoDB aggregations.
 *
 * Mentor status is PER SKILL via the MentorSkill collection.
 * There is no separate Mentor role — mentor status is derived from approved MentorSkill records.
 */

const User = require('../models/User');
const Skill = require('../models/Skill');
const Session = require('../models/Session');
const MentorSkill = require('../models/MentorSkill');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── 1. Unified User Dashboard ───────────────────────────────────────────────
/**
 * @route   GET /api/dashboard/user
 * @route   GET /api/v1/dashboard/user
 * @access  Private — User
 *
 * Returns learning metrics for all users.
 * If the user has at least one APPROVED MentorSkill, teaching metrics are included.
 */
const getUserDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // --- Learning Metrics (All users) ---
    const totalSessionsBooked = await Session.countDocuments({ student: userId });
    const completedSessions = await Session.countDocuments({ student: userId, status: 'completed' });
    const upcomingSessions = await Session.countDocuments({ student: userId, status: 'accepted' });
    const pendingRequests = await Session.countDocuments({ student: userId, status: 'pending' });

    const distinctSkillsLearned = await Session.distinct('skillName', { student: userId });
    const skillsLearning = req.user.skillsLearning?.length || distinctSkillsLearned.length;

    const xpPoints = req.user.xp || (completedSessions * 50 + 100);

    const recentSessions = await Session.find({ student: userId })
        .populate('mentor', 'fullName department')
        .sort('-updatedAt')
        .limit(5);

    const recentActivities = recentSessions.map(s => ({
        id: s._id,
        text: `Session "${s.skillName}" with ${s.mentor?.fullName || 'Mentor'} is ${s.status}.`,
        time: new Date(s.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: s.status,
    }));

    const recentNotifications = recentSessions.map(s => ({
        id: s._id,
        text: `Booking status updated to ${s.status} for ${s.skillName}.`,
        type: s.status === 'accepted' || s.status === 'completed' ? 'success' : s.status === 'pending' ? 'info' : 'warning',
        timestamp: s.updatedAt,
    }));

    // --- Mentor Skill Status ---
    // Fetch approved MentorSkills for this user (determines teaching access)
    const approvedMentorSkills = await MentorSkill.find({ userId, status: 'approved' }).sort('skillName');
    const pendingMentorSkills = await MentorSkill.find({ userId, status: 'pending' }).sort('skillName');

    const isVerifiedMentor = approvedMentorSkills.length > 0;
    const approvedSkillNames = approvedMentorSkills.map(ms => ms.skillName);

    // Response Base Object (Learning Section)
    const responsePayload = {
        isVerifiedMentor,
        approvedSkillNames,   // per-skill list for Teaching Section display
        pendingSkillCount: pendingMentorSkills.length,
        totalSessionsBooked,
        completedSessions,
        upcomingSessions,
        pendingRequests,
        skillsLearning,
        xpPoints,
        recentNotifications,
        recentActivities,
    };

    // --- Teaching Metrics (ONLY if user has at least one approved MentorSkill) ---
    if (isVerifiedMentor) {
        const distinctStudents = await Session.distinct('student', {
            mentor: userId,
            status: { $in: ['accepted', 'completed'] }
        });
        const totalStudentsMentored = distinctStudents.length;

        const pendingBookingRequests = await Session.countDocuments({ mentor: userId, status: 'pending' });
        const acceptedSessions = await Session.countDocuments({ mentor: userId, status: 'accepted' });
        const completedSessionsTeaching = await Session.countDocuments({ mentor: userId, status: 'completed' });

        const mentorRating = req.user.mentorRating || req.user.rating || 4.8;

        const recentRequests = await Session.find({ mentor: userId })
            .populate('student', 'fullName department')
            .sort('-updatedAt')
            .limit(5);

        const teachingActivities = recentRequests.map(s => ({
            id: s._id,
            text: `${s.student?.fullName || 'Student'} requested session for "${s.skillName}" (${s.status}).`,
            time: new Date(s.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: s.status,
        }));

        Object.assign(responsePayload, {
            totalStudentsMentored,
            pendingBookingRequests,
            acceptedSessions,
            completedSessionsTeaching,
            mentorRating,
            skillsTeaching: approvedSkillNames.length,
            teachingActivities,
        });
    }

    sendSuccess(res, 200, 'User dashboard metrics retrieved successfully.', responsePayload);
});

// Alias handlers for legacy student & mentor routes
const getStudentDashboard = getUserDashboard;
const getMentorDashboard = getUserDashboard;

// ─── 2. Faculty Dashboard ────────────────────────────────────────────────────
/**
 * @route   GET /api/dashboard/faculty
 * @route   GET /api/v1/dashboard/faculty
 * @access  Private — Faculty
 *
 * Uses MentorSkill collection (not legacy MentorApplication).
 */
const getFacultyDashboard = asyncHandler(async (req, res) => {
    const totalMentorApplications = await MentorSkill.countDocuments();
    const pendingVerifications = await MentorSkill.countDocuments({ status: 'pending' });
    const approvedMentors = await MentorSkill.countDocuments({ status: 'approved' });
    const rejectedApplications = await MentorSkill.countDocuments({ status: 'rejected' });
    const totalSkills = await Skill.countDocuments();

    // Department statistics aggregation
    const departmentStatistics = await User.aggregate([
        {
            $group: {
                _id: '$department',
                totalUsers: { $sum: 1 },
                verifiedMentorsCount: { $sum: { $cond: ['$isVerifiedMentor', 1, 0] } },
            }
        },
        { $sort: { totalUsers: -1 } }
    ]);

    // Recent activity log from MentorSkill applications
    const recentApps = await MentorSkill.find()
        .populate('userId', 'fullName department registerNumber')
        .sort('-createdAt')
        .limit(5);

    const recentActivities = recentApps.map(a => ({
        id: a._id,
        text: `Application by ${a.userId?.fullName || 'User'} (${a.userId?.department}) for "${a.skillName}" is ${a.status}. Score: ${a.assessmentScore}/${a.totalQuestions || 20}`,
        time: new Date(a.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: a.status,
    }));

    sendSuccess(res, 200, 'Faculty dashboard metrics retrieved successfully.', {
        totalMentorApplications,
        pendingVerifications,
        approvedMentors,
        rejectedApplications,
        totalSkills,
        departmentStatistics,
        recentActivities,
    });
});

// ─── 3. Admin Dashboard ──────────────────────────────────────────────────────
/**
 * @route   GET /api/dashboard/admin
 * @route   GET /api/v1/dashboard/admin
 * @access  Private — Admin
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalSkills = await Skill.countDocuments();
    const totalBookings = await Session.countDocuments();
    const totalSessionsCompleted = await Session.countDocuments({ status: 'completed' });

    // Total unique users with at least one approved MentorSkill
    const mentorUserIds = await MentorSkill.distinct('userId', { status: 'approved' });
    const totalMentors = mentorUserIds.length;

    // Platform statistics aggregation
    const platformStatistics = await User.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 }
            }
        }
    ]);

    const bookingStatusStats = await Session.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const recentSessions = await Session.find()
        .populate('student', 'fullName')
        .populate('mentor', 'fullName')
        .sort('-createdAt')
        .limit(5);

    const recentActivities = recentSessions.map(s => ({
        id: s._id,
        text: `Booking "${s.skillName}" (${s.student?.fullName} ➔ ${s.mentor?.fullName}) is ${s.status}.`,
        time: new Date(s.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: s.status,
    }));

    sendSuccess(res, 200, 'Admin dashboard metrics retrieved successfully.', {
        totalUsers,
        totalStudents: totalUsers,
        totalMentors,
        totalFaculty,
        totalSkills,
        totalBookings,
        totalSessionsCompleted,
        platformStatistics: {
            userRoles: platformStatistics,
            bookingStatuses: bookingStatusStats,
        },
        recentActivities,
    });
});

// ─── Combined General Dashboard ──────────────────────────────────────────────
/**
 * @route   GET /api/dashboard
 * @route   GET /api/v1/dashboard
 * @access  Private — All roles
 */
const getDashboard = asyncHandler(async (req, res) => {
    const role = req.user.role;
    if (role === 'faculty') return getFacultyDashboard(req, res);
    if (role === 'admin') return getAdminDashboard(req, res);

    return getUserDashboard(req, res);
});

module.exports = {
    getDashboard,
    getUserDashboard,
    getStudentDashboard,
    getMentorDashboard,
    getFacultyDashboard,
    getAdminDashboard,
};
