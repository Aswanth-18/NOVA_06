/**
 * @file userRoutes.js
 * @description User management routes with RBAC enforcement.
 *
 * Route → Access Matrix
 * ─────────────────────────────────────────────────────────
 * GET    /api/v1/users       → admin only
 * GET    /api/v1/users/:id   → authenticated (own profile or admin)
 * PUT    /api/v1/users/:id   → authenticated (own profile update)
 * DELETE /api/v1/users/:id   → admin only
 * ─────────────────────────────────────────────────────────
 */

const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

// All user routes require authentication
router.use(authenticateUser);

// ── GET /api/v1/users ──────────────────────────────────────────────────────────
// Admin only — list all users in the system
router.get(
    '/',
    authorizeRoles('admin'),
    getAllUsers
);

// ── GET /api/v1/users/:id ──────────────────────────────────────────────────────
// Any authenticated user can view a profile (own or others)
router.get(
    '/:id',
    authorizeRoles('user', 'faculty', 'admin'),
    getUserById
);

// ── PUT /api/v1/users/:id ──────────────────────────────────────────────────────
// Any authenticated user can update their own profile
// (Controller will enforce that users can only edit their own document)
router.put(
    '/:id',
    authorizeRoles('user', 'faculty', 'admin'),
    updateUser
);

// ── DELETE /api/v1/users/:id ───────────────────────────────────────────────────
// Admin only — remove a user from the system
router.delete(
    '/:id',
    authorizeRoles('admin'),
    deleteUser
);

module.exports = router;
