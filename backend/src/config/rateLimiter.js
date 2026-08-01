/**
 * @file rateLimiter.js
 * @description Express-rate-limit configuration to protect the API from abuse.
 */

const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5000,                        // requests per window (increased for local development)
    standardHeaders: true,  // Return rate-limit info in RateLimit-* headers
    legacyHeaders: false,   // Disable X-RateLimit-* headers
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again later.',
    },
});

module.exports = rateLimiter;
