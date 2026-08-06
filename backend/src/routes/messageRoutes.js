const express = require('express');
const router = express.Router();

const { getMessagesByConversation, sendMessage, markMessageAsRead } = require('../controllers/sessionController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

router.use(authenticateUser);

// GET /messages/:conversationId -> Retrieve messages for a booking conversation
router.get('/:conversationId', authorizeRoles('user'), getMessagesByConversation);

// POST /messages -> Send a message
router.post('/', authorizeRoles('user'), sendMessage);

// PUT /messages/read/:id -> Mark a message as read
router.put('/read/:id', authorizeRoles('user'), markMessageAsRead);

module.exports = router;
