/**
 * @file leaderboardController.js
 * @description Leaderboard, XP, and Achievement Module Controller.
 */

const User = require('../models/User');
const { Achievement, Badge } = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Compute badge based on XP and role
 */
function computeBadge(xp, role, isVerifiedMentor) {
    if (xp >= 3000) return 'Coding Expert';
    if (xp >= 2000) return 'Placement Champion';
    if (xp >= 1200) return 'Top Mentor';
    if (xp >= 800) return 'Community Helper';
    if (isVerifiedMentor || role === 'mentor') return 'Verified Mentor';
    if (xp >= 300) return 'Top Learner';
    if (xp >= 100) return 'Rising Learner';
    return 'Beginner';
}

/**
 * Utility helper to add XP to a user and update level & badge
 */

const addXP = async (userId, xpAmount) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        const newXp = (user.xp || 0) + xpAmount;
        const newLevel = Math.floor(newXp / 100) + 1;
        const newBadge = computeBadge(newXp, user.role, user.isVerifiedMentor);

        user.xp = newXp;
        user.level = newLevel;
        user.badge = newBadge;
        await user.save();
    } catch (err) {
        console.error('Error adding XP to user:', err);
    }
};

/**
 * @route   GET /api/leaderboard
 * @route   GET /api/v1/leaderboard
 * @access  Private — All authenticated roles
 * @desc    Get leaderboard entries with role, department, time, and search filters.
 */
const getLeaderboard = asyncHandler(async (req, res) => {
    const { role, department, time, search } = req.query;

    const filter = {};

    // Always exclude faculty and admin from leaderboard
    filter.role = { $nin: ['faculty', 'admin'] };

    if (role === 'Students') {
        // Students: role=user and NOT verified mentor
        filter.role = 'user';
        filter.isVerifiedMentor = false;
    } else if (role === 'Mentors') {
        // Mentors: users who have been verified for at least one skill
        filter.role = 'user';
        filter.isVerifiedMentor = true;
    } else {
        // Overall: all users (role=user), both mentors and learners
        filter.role = 'user';
    }

    if (department && department !== 'All Departments') {
        filter.department = department;
    }

    if (search) {
        const q = search.trim();
        filter.$or = [
            { fullName: { $regex: q, $options: 'i' } },
            { department: { $regex: q, $options: 'i' } }
        ];
    }

    // Fetch users sorted by XP descending
    let users = await User.find(filter)
        .select('fullName email registerNumber department role profileImage isVerifiedMentor xp level badge completedSessionsCount rating updatedAt')
        .sort('-xp');

    // Format leaderboard items
    const leaderboard = users.map((u, idx) => ({
        rank: idx + 1,
        _id: u._id,
        name: u.fullName || 'User',
        dept: u.department || 'CSE',
        role: u.isVerifiedMentor ? 'Mentor' : 'Student',
        xp: u.xp || 100,
        monthly_xp: Math.round((u.xp || 100) * 0.3),
        level: u.level || Math.floor((u.xp || 100) / 100) + 1,
        badge: u.badge || computeBadge(u.xp || 100, u.role, u.isVerifiedMentor),
        sessions: u.completedSessionsCount || 0,
        rating: u.rating || 4.8,
        avatar: u.profileImage || '',
    }));

    sendSuccess(res, 200, 'Leaderboard data fetched successfully.', leaderboard);
});

/**
 * @route   GET /api/leaderboard/students
 * @route   GET /api/v1/leaderboard/students
 * @access  Private — All authenticated roles
 */
const getStudentsLeaderboard = asyncHandler(async (req, res) => {
    req.query.role = 'Students';
    return getLeaderboard(req, res);
});

/**
 * @route   GET /api/leaderboard/mentors
 * @route   GET /api/v1/leaderboard/mentors
 * @access  Private — All authenticated roles
 */
const getMentorsLeaderboard = asyncHandler(async (req, res) => {
    req.query.role = 'Mentors';
    return getLeaderboard(req, res);
});

/**
 * @route   GET /api/leaderboard/department/:department
 * @route   GET /api/v1/leaderboard/department/:department
 * @access  Private — All authenticated roles
 */
const getDepartmentLeaderboard = asyncHandler(async (req, res) => {
    req.query.department = req.params.department;
    return getLeaderboard(req, res);
});

/**
 * @route   GET /api/achievements
 * @route   GET /api/v1/achievements
 * @access  Private — All authenticated roles
 */
const getAchievements = asyncHandler(async (req, res) => {
    const achievements = [
        { id: '1', title: 'Top Mentor of the Month', icon: 'Crown', color: '#f59e0b', name: 'Priya Nair', desc: '184 sessions · 4.9 ★' },
        { id: '2', title: 'Fastest Learner', icon: 'Flame', color: '#ef4444', name: 'Elena Rostova', desc: '+1,020 XP in 30 days' },
        { id: '3', title: 'Most Active Student', icon: 'Target', color: '#6366f1', name: 'Arjun Mehta', desc: '104 sessions completed' },
        { id: '4', title: 'Highest Rated Mentor', icon: 'Star', color: '#a855f7', name: 'Michael Chang', desc: '4.8 ★ from 162 sessions' },
    ];

    const badges = [
        { name: 'Beginner', xp: 0, color: '#cd7f32' },
        { name: 'Rising Learner', xp: 100, color: '#6366f1' },
        { name: 'Top Learner', xp: 300, color: '#3b82f6' },
        { name: 'Verified Mentor', xp: 500, color: '#10b981' },
        { name: 'Community Helper', xp: 800, color: '#a855f7' },
        { name: 'Top Mentor', xp: 1200, color: '#f59e0b' },
        { name: 'Placement Champion', xp: 2000, color: '#ef4444' },
        { name: 'Coding Expert', xp: 3000, color: '#ec4899' },
    ];

    sendSuccess(res, 200, 'Achievements and badges fetched successfully.', { achievements, badges });
});

/**
 * @route   GET /api/xp
 * @route   GET /api/v1/xp
 * @access  Private — Authenticated User
 * @desc    Get user XP, level, rank, and badge progress.
 */
const getUserXP = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return sendError(res, 404, 'User not found.');
    }

    const currentXp = user.xp || 100;
    const level = Math.floor(currentXp / 100) + 1;
    const nextLevelXp = level * 100;
    const badge = computeBadge(currentXp, user.role, user.isVerifiedMentor);

    // Compute rank
    const higherXpCount = await User.countDocuments({ xp: { $gt: currentXp } });
    const rank = higherXpCount + 1;

    sendSuccess(res, 200, 'User XP fetched successfully.', {
        name: user.fullName,
        xp: currentXp,
        level,
        nextLevelXp,
        badge,
        rank,
        completedSessionsCount: user.completedSessionsCount || 0,
        rating: user.rating || 4.8,
    });
});

module.exports = {
    addXP,
    computeBadge,
    getLeaderboard,
    getStudentsLeaderboard,
    getMentorsLeaderboard,
    getDepartmentLeaderboard,
    getAchievements,
    getUserXP,
};
