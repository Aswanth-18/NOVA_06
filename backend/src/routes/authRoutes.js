/**
 * @file authRoutes.js
 * @description Authentication routes for SkillSync.
 */

const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/signup
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user account in MongoDB
 * @access  Public
 */
router.post('/signup', signup);
router.post('/register', signup);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get the authenticated user's profile
 * @access  Private
 */
router.get('/me', authenticateUser, getMe);

module.exports = router;
