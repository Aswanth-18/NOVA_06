/**
 * @file sessionRoutes.js
 * @description Routes for Sessions module with RBAC enforcement.
 */

const express = require('express');
const router = express.Router();

const {
    getAllSessions,
    getSessionById,
    createSession,
    updateSessionStatus,
} = require('../controllers/sessionController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// All session routes require authentication
router.use(authenticateUser);

// ─── Session Routes ───────────────────────────────────────────────────────────
router.get('/', authorizeRoles('user'), getAllSessions);
router.get('/:id', authorizeRoles('user'), getSessionById);
router.post('/', authorizeRoles('user'), createSession);
router.patch('/:id/status', authorizeRoles('user'), updateSessionStatus);

module.exports = router;
