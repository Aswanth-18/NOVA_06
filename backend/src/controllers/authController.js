/**
 * @file authController.js
 * @description Authentication controller — Signup, Login, GetMe.
 *
 * POST /api/v1/auth/signup  → Create account + return JWT
 * POST /api/v1/auth/register → Create account + return JWT
 * POST /api/v1/auth/login   → Verify credentials + return JWT
 * GET  /api/v1/auth/me      → Return authenticated user's profile
 */

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Department normalization helper
 */
function normalizeDepartment(dept) {
    if (!dept) return 'CSE';
    const upper = dept.toUpperCase().trim();
    const validDepts = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML', 'CSD', 'CSBS', 'OTHER'];
    if (validDepts.includes(upper)) return upper;

    if (upper.includes('CS') || upper.includes('COMP')) return 'CSE';
    if (upper.includes('IT') || upper.includes('INFO')) return 'IT';
    if (upper.includes('EC')) return 'ECE';
    if (upper.includes('ME')) return 'MECH';
    if (upper.includes('AI') || upper.includes('DATA')) return 'AIDS';

    return 'OTHER';
}

/**
 * Builds the standard auth response payload.
 */
const respondWithToken = (res, statusCode, message, user) => {
    const token = generateToken({ id: user._id, role: user.role });

    sendSuccess(res, statusCode, message, {
        token,
        user: user.toPublicJSON(),
    });
};

/**
 * @route   POST /api/v1/auth/signup
 * @route   POST /api/v1/auth/register
 * @access  Public
 * @desc    Register a new user in MongoDB, hash password, and return JWT.
 */
const signup = asyncHandler(async (req, res) => {
    const {
        fullName,
        name,
        registerNumber,
        email,
        password,
        department,
        year,
        role,
    } = req.body;

    const userName = (fullName || name || '').trim();
    const userEmail = (email || '').toLowerCase().trim();

    // 1. Validate required fields
    if (!userName) return sendError(res, 400, 'Full name is required.');
    if (!userEmail) return sendError(res, 400, 'Email address is required.');
    if (!password || password.length < 6) return sendError(res, 400, 'Password must be at least 6 characters.');

    // Auto-generate registerNumber if not provided
    const regNum = (registerNumber && registerNumber.trim())
        ? registerNumber.toUpperCase().trim()
        : `REG${Math.floor(100000 + Math.random() * 900000)}`;

    const normDept = normalizeDepartment(department);
    const parsedYear = Number(year) >= 1 && Number(year) <= 4 ? Number(year) : 1;
    const userRole = (role && ['user', 'faculty', 'admin'].includes(role.toLowerCase()))
        ? role.toLowerCase()
        : 'user';

    // 2. Check for duplicate email
    const existingUser = await User.findOne({
        $or: [
            { email: userEmail },
            { registerNumber: regNum },
        ],
    });

    if (existingUser) {
        if (existingUser.email === userEmail) {
            return sendError(res, 409, 'An account with this email address already exists.');
        }
    }

    // 3. Create user in MongoDB
    const user = await User.create({
        fullName: userName,
        registerNumber: regNum,
        email: userEmail,
        password,            // Raw — hashed by User model pre-save hook
        department: normDept,
        year: parsedYear,
        role: userRole,
    });

    console.log(`[AUTH] Successfully registered new user in MongoDB: ${user.email} (${user._id})`);

    // 4. Respond with token + user object
    respondWithToken(res, 201, 'Account created successfully in database.', user);
});

/**
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
        return sendError(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return sendError(res, 401, 'Invalid email or password.');
    }

    respondWithToken(res, 200, 'Login successful.', user);
});

/**
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return sendError(res, 404, 'User not found.');
    }

    sendSuccess(res, 200, 'User profile retrieved.', { user: user.toPublicJSON() });
});

module.exports = { signup, login, getMe };
