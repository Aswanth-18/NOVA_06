/**
 * @file index.js
 * @description Central route registry.
 * All API routes are mounted here and consumed by app.js.
 *
 * Base prefix: /api/v1  (set in app.js)
 */

const express = require('express');

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');
const skillRoutes = require('./skillRoutes');
const sessionRoutes = require('./sessionRoutes');
const mentorRoutes = require('./mentorRoutes');
const bookingRoutes = require('./bookingRoutes');
const studentRoutes = require('./studentRoutes');

const router = express.Router();

// ─── Health Check ─────────────────────────────────────────────────────────────

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SkillSync API is healthy 🚀',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
        endpoints: {
            auth: 'POST /signup  |  POST /login  |  GET /me',
            dashboard: 'GET  /api/v1/dashboard          → all authenticated roles',
            skills: 'GET  /api/v1/skills             → all authenticated roles\n' +
                '                POST|PUT|DELETE  → faculty, admin',
            sessions: 'GET  /api/v1/sessions           → student, mentor\n' +
                '                POST             → student only\n' +
                '                PATCH /:id/status→ mentor only',
            mentor: 'POST /api/v1/mentor/apply       → student only\n' +
                '                GET /applications → faculty, admin\n' +
                '                POST /approve/:id → faculty only\n' +
                '                GET /students    → mentor only\n' +
                '                PATCH /availability → mentor only',
            bookings: 'POST /api/v1/bookings           → student only\n' +
                '                GET              → student, mentor',
            users: 'GET  /api/v1/users              → admin only\n' +
                '                GET|PUT /:id     → all authenticated roles\n' +
                '                DELETE /:id      → admin only',
        },
    });
});

// ─── Route Mounts ─────────────────────────────────────────────────────────────

const leaderboardRoutes = require('./leaderboardRoutes');
const announcementRoutes = require('./announcementRoutes');

router.use('/auth', authRoutes);      // Public auth (signup/login), GET /me protected
router.use('/dashboard', dashboardRoutes); // All authenticated roles
router.use('/users', userRoutes);      // RBAC per-route
router.use('/skills', skillRoutes);     // RBAC per-route
router.use('/sessions', sessionRoutes);   // RBAC per-route
router.use('/mentor', mentorRoutes);    // RBAC per-route
router.use('/bookings', bookingRoutes);
router.use('/students', studentRoutes);   // RBAC per-route
router.use('/conversations', sessionRoutes);
router.use('/messages', sessionRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/achievements', leaderboardRoutes);
router.use('/xp', leaderboardRoutes);
router.use('/announcements', announcementRoutes);

module.exports = router;
