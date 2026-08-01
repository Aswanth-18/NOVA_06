/**
 * @file mentorRoutes.js
 * @description Express router for Become Mentor workflow and Faculty verification.
 *
 * Architecture:
 *  - Mentor status is PER SKILL (MentorSkill collection), not per-account.
 *  - Every account is a 'user'. There is no 'mentor' or 'student' role.
 *  - Valid roles: user | faculty | admin
 */

const express = require('express');
const router = express.Router();

const {
    getStudentStatus,
    getMyMentorSkills,
    applyAsMentor,
    getMentorApplications,
    approveMentor,
    getAssignedStudents,
    getMentorsForSkill,
    updateAvailability,
} = require('../controllers/mentorController');

const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');

// Enforce authentication on all mentor routes
router.use(authenticateUser);

// ─── User Routes (any authenticated user) ────────────────────────────────────

// GET /api/v1/mentor/my-status → Check application & retake timer status (per-skill)
router.get('/my-status', authorizeRoles('user', 'faculty', 'admin'), getStudentStatus);

// GET /api/v1/mentor/my-skills → Returns ONLY approved MentorSkill records for current user
router.get('/my-skills', authorizeRoles('user', 'faculty', 'admin'), getMyMentorSkills);

// POST /api/v1/mentor/apply → Submit assessment results, creates MentorSkill records per skill
router.post('/apply', authorizeRoles('user'), applyAsMentor);

// GET /api/v1/mentor/mentors-for-skill → Returns approved mentors for a given skill
// Used by Marketplace and BookSession pages. ?skill=Java
router.get('/mentors-for-skill', authorizeRoles('user', 'faculty', 'admin'), getMentorsForSkill);

// GET /api/v1/mentor/students → Sessions assigned to this user as a mentor
router.get('/students', authorizeRoles('user', 'admin'), getAssignedStudents);

// PATCH /api/v1/mentor/availability → Update teaching availability
router.patch('/availability', authorizeRoles('user', 'admin'), updateAvailability);

// ─── Faculty & Admin Routes ───────────────────────────────────────────────────

// GET /api/v1/mentor/applications → Faculty views all pending/approved/rejected MentorSkill records
router.get('/applications', authorizeRoles('faculty', 'admin'), getMentorApplications);

// PUT  /api/v1/mentor/approve/:id → Faculty approves or rejects ONE MentorSkill record
// POST /api/v1/mentor/approve/:id → Same (form-submit compat)
router.put('/approve/:id', authorizeRoles('faculty', 'admin'), approveMentor);
router.post('/approve/:id', authorizeRoles('faculty', 'admin'), approveMentor);

module.exports = router;
