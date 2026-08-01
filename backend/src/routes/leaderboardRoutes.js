/**
 * @file leaderboardRoutes.js
 * @description Routes for Leaderboard, XP, and Achievement Module.
 */

const express = require('express');
const router = express.Router();

const {
    getLeaderboard,
    getStudentsLeaderboard,
    getMentorsLeaderboard,
    getDepartmentLeaderboard,
    getAchievements,
    getUserXP,
} = require('../controllers/leaderboardController');

const authenticateUser = require('../middleware/authenticateUser');

// Enforce authentication for all leaderboard routes
router.use(authenticateUser);

/**
 * @route   GET /api/leaderboard
 * @route   GET /api/v1/leaderboard
 */
router.get('/', getLeaderboard);

/**
 * @route   GET /api/leaderboard/students
 * @route   GET /api/v1/leaderboard/students
 */
router.get('/students', getStudentsLeaderboard);

/**
 * @route   GET /api/leaderboard/mentors
 * @route   GET /api/v1/leaderboard/mentors
 */
router.get('/mentors', getMentorsLeaderboard);

/**
 * @route   GET /api/leaderboard/department/:department
 * @route   GET /api/v1/leaderboard/department/:department
 */
router.get('/department/:department', getDepartmentLeaderboard);

/**
 * @route   GET /api/achievements
 * @route   GET /api/v1/achievements
 */
router.get('/achievements', getAchievements);

/**
 * @route   GET /api/xp
 * @route   GET /api/v1/xp
 */
router.get('/xp', getUserXP);

module.exports = router;
