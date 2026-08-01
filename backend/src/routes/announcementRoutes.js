/**
 * @file announcementRoutes.js
 * @description Announcement routes.
 */

const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const authenticateUser = require('../middleware/authenticateUser');

router.use(authenticateUser);

router.get('/', getAnnouncements);
router.post('/', createAnnouncement);
router.delete('/:id', deleteAnnouncement);

module.exports = router;
