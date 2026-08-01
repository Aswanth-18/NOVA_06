/**
 * @file bookingRoutes.js
 * @description Routes for Session Booking module with role-based authorization.
 *
 * Valid roles: user | faculty | admin
 * Per-skill mentor verification is enforced inside bookingController.createBooking.
 */

const express = require('express');
const router = express.Router();

const {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
} = require('../controllers/bookingController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// Enforce authentication for all booking routes
router.use(authenticateUser);

/**
 * @route   GET /api/v1/bookings
 * @access  All authenticated roles (user, faculty, admin)
 */
router.get('/', authorizeRoles('user', 'faculty', 'admin'), getBookings);

/**
 * @route   GET /api/v1/bookings/:id
 * @access  All authenticated roles
 */
router.get('/:id', authorizeRoles('user', 'faculty', 'admin'), getBookingById);

/**
 * @route   POST /api/v1/bookings
 * @access  User only (Faculty & Admin blocked inside controller)
 */
router.post('/', authorizeRoles('user'), createBooking);

/**
 * @route   PUT /api/v1/bookings/:id/status
 * @route   PUT /api/v1/bookings/:id
 * @access  User (cancel pending only / accept-reject-complete as mentor), Admin
 */
router.put('/:id/status', authorizeRoles('user', 'admin'), updateBookingStatus);
router.put('/:id', authorizeRoles('user', 'admin'), updateBookingStatus);

/**
 * @route   DELETE /api/v1/bookings/:id
 * @access  User, Admin
 */
router.delete('/:id', authorizeRoles('user', 'admin'), deleteBooking);

module.exports = router;
