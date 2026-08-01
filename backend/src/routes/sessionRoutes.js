/**
 * @file sessionRoutes.js
 * @description Routes for Messages & Sessions module with RBAC enforcement.
 */

const express = require('express');
const router = express.Router();

const {
    getConversations,
    getMessagesByConversation,
    sendMessage,
    markMessageAsRead,
    getAllSessions,
    getSessionById,
    createSession,
    updateSessionStatus,
} = require('../controllers/sessionController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// All messaging & session routes require authentication
router.use(authenticateUser);

// ─── Messaging Routes (Student & Mentor ONLY) ─────────────────────────────────

// GET /conversations -> Retrieve list of active conversations from accepted bookings
router.get('/conversations', authorizeRoles('user'), getConversations);

// GET /messages/:conversationId -> Retrieve messages for a booking conversation
router.get('/messages/:conversationId', authorizeRoles('user'), getMessagesByConversation);

// POST /messages -> Send a message
router.post('/messages', authorizeRoles('user'), sendMessage);

// PUT /messages/read/:id -> Mark a message as read
router.put('/messages/read/:id', authorizeRoles('user'), markMessageAsRead);

// ─── Session Routes ───────────────────────────────────────────────────────────
router.get('/', authorizeRoles('user'), getAllSessions);
router.get('/:id', authorizeRoles('user'), getSessionById);
router.post('/', authorizeRoles('user'), createSession);
router.patch('/:id/status', authorizeRoles('user'), updateSessionStatus);

module.exports = router;
