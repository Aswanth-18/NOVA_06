/**
 * @file dashboardRoutes.js
 * @description Dashboard routes protected with role-based authorization.
 */

const express = require('express');
const router = express.Router();

const {
    getDashboard,
    getUserDashboard,
    getStudentDashboard,
    getMentorDashboard,
    getFacultyDashboard,
    getAdminDashboard,
} = require('../controllers/dashboardController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// Enforce authentication for all dashboard routes
router.use(authenticateUser);

/**
 * @route   GET /api/dashboard
 * @route   GET /api/v1/dashboard
 * @access  All authenticated roles
 */
router.get('/', getDashboard);

/**
 * @route   GET /api/dashboard/user
 * @route   GET /api/v1/dashboard/user
 * @access  User, Admin
 */
router.get('/user', authorizeRoles('user', 'admin'), getUserDashboard);

/**
 * @route   GET /api/dashboard/student
 * @route   GET /api/v1/dashboard/student
 * @access  User, Admin
 */
router.get('/student', authorizeRoles('user', 'admin'), getStudentDashboard);

/**
 * @route   GET /api/dashboard/mentor
 * @route   GET /api/v1/dashboard/mentor
 * @access  User, Admin
 */
router.get('/mentor', authorizeRoles('user', 'admin'), getMentorDashboard);

/**
 * @route   GET /api/dashboard/faculty
 * @route   GET /api/v1/dashboard/faculty
 * @access  Faculty, Admin
 */
router.get('/faculty', authorizeRoles('faculty', 'admin'), getFacultyDashboard);

/**
 * @route   GET /api/dashboard/admin
 * @route   GET /api/v1/dashboard/admin
 * @access  Admin
 */
router.get('/admin', authorizeRoles('admin'), getAdminDashboard);

module.exports = router;
