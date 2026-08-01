/**
 * @file corsOptions.js
 * @description CORS configuration derived from environment variables.
 */

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Allow any local origin in development (e.g. localhost, 127.0.0.1 on any port)
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS policy: Origin '${origin}' is not allowed.`));
    },
    credentials: true, // Allow cookies / Authorization headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
