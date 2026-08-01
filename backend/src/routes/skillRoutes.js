/**
 * @file skillRoutes.js
 * @description Routes for Skill Management Module.
 */

const express = require('express');
const router = express.Router();

const {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// Enforce authentication on all skill routes
router.use(authenticateUser);

/**
 * @route   GET /api/skills
 * @access  Student, Mentor, Faculty, Admin
 */
router.get(
    '/',
    authorizeRoles('user', 'faculty', 'admin'),
    getAllSkills
);

/**
 * @route   GET /api/skills/:id
 * @access  All authenticated roles (user, faculty, admin)
 */
router.get(
    '/:id',
    authorizeRoles('user', 'faculty', 'admin'),
    getSkillById
);

/**
 * @route   POST /api/skills
 * @access  Faculty, Admin
 */
router.post(
    '/',
    authorizeRoles('faculty', 'admin'),
    createSkill
);

/**
 * @route   PUT /api/skills/:id
 * @access  Faculty, Admin
 */
router.put(
    '/:id',
    authorizeRoles('faculty', 'admin'),
    updateSkill
);

/**
 * @route   DELETE /api/skills/:id
 * @access  Faculty, Admin
 */
router.delete(
    '/:id',
    authorizeRoles('faculty', 'admin'),
    deleteSkill
);

module.exports = router;
