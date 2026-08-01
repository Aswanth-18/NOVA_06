const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

router.use(authenticateUser);

// Mentor: GET /api/students
router.get('/', authorizeRoles('user'), (req, res) => {
    res.status(200).json({ success: true, message: 'View Students (Mentor)' });
});

module.exports = router;
