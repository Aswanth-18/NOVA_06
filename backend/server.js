/**
 * @file server.js
 * @description Application entry point.
 * Loads environment variables, connects to MongoDB, and starts the HTTP server.
 */

// Load env vars FIRST — before any other module reads process.env
require('dotenv').config();

const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// ─── Connect to Database Then Start Server ────────────────────────────────────
const startServer = async () => {
    // Establish DB connection; exits process on failure
    await connectDB();

    // Migration logic to transition legacy 'student' and 'mentor' roles to 'user'
    try {
        const User = require('./src/models/User');
        const mentorUpdate = await User.updateMany(
            { role: 'mentor' },
            { $set: { role: 'user', isVerifiedMentor: true } }
        );
        const studentUpdate = await User.updateMany(
            { role: 'student' },
            { $set: { role: 'user' } }
        );
        if (mentorUpdate.modifiedCount > 0 || studentUpdate.modifiedCount > 0) {
            console.log(`[MIGRATION] Migrated legacy roles: ${mentorUpdate.modifiedCount} mentors -> user (verified), ${studentUpdate.modifiedCount} students -> user.`);
        }
    } catch (migErr) {
        console.error('[MIGRATION] Migration error (non-fatal):', migErr.message);
    }

    const server = app.listen(PORT, () => {
        console.log('');
        console.log('╔══════════════════════════════════════════╗');
        console.log(`║   SkillSync API Server                   ║`);
        console.log(`║   Mode   : ${process.env.NODE_ENV.padEnd(30)}║`);
        console.log(`║   Port   : ${String(PORT).padEnd(30)}║`);
        console.log(`║   URL    : http://localhost:${PORT}/api/v1   ║`);
        console.log('╚══════════════════════════════════════════╝');
        console.log('');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`\n❌ Error: Port ${PORT} is already in use by another process!`);
            console.error(`👉 Please kill the process using port ${PORT} or update PORT in backend/.env\n`);
        } else {
            console.error('\n❌ Server error:', err.message);
        }
        process.exit(1);
    });

    // ─── Graceful Shutdown ──────────────────────────────────────────────────────
    const gracefulShutdown = (signal) => {
        console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
            console.log('🔌  HTTP server closed.');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ─── Unhandled Rejection Safety Net ────────────────────────────────────────
    process.on('unhandledRejection', (reason, promise) => {
        console.error('🔴 Unhandled Promise Rejection:', reason);
        if (process.env.NODE_ENV === 'production') {
            server.close(() => process.exit(1));
        }
    });
};

startServer();
