/**
 * @file app.js
 * @description Express application factory.
 * Configures all middleware and mounts the API routes.
 * Does NOT start the server — that is server.js's responsibility.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const corsOptions = require('./src/config/corsOptions');
const rateLimiter = require('./src/config/rateLimiter');
const apiRoutes = require('./src/routes/index');
const notFound = require('./src/middleware/notFound');
const errorHandler = require('./src/middleware/errorHandler');

// ─── Create Express App ───────────────────────────────────────────────────────
const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());           // Sets secure HTTP headers
app.use(cors(corsOptions));  // CORS with allowed origins from config
app.options('*', cors(corsOptions)); // Handle pre-flight requests

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', rateLimiter);

// ─── Request Logging ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));           // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse form bodies

const bookingRoutes = require('./src/routes/bookingRoutes');
const sessionRoutes = require('./src/routes/sessionRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/conversations', sessionRoutes);
app.use('/api/messages', sessionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', leaderboardRoutes);
app.use('/api/xp', leaderboardRoutes);
app.use('/api/announcements', announcementRoutes);

// ─── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the SkillSync API',
        version: '1.0.0',
        docs: '/api/v1/health',
    });
});

// ─── 404 Catcher ─────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be the LAST middleware registered
app.use(errorHandler);

module.exports = app;
