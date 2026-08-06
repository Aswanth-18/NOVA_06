const express = require('express');
const router = express.Router();

const { getConversations } = require('../controllers/sessionController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

router.use(authenticateUser);

// GET /conversations -> Retrieve list of active conversations from accepted bookings
router.get('/', authorizeRoles('user'), getConversations);

module.exports = router;
