/**
 * @file db.js
 * @description MongoDB connection configuration using Mongoose.
 */

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Exits the process immediately if the connection fails on startup.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            console.error('❌  MONGO_URI is not defined in your .env file.');
            process.exit(1);
        }

        // Log which database we are connecting to (hide credentials)
        const safeUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://<user>:<pass>@');
        console.log(`🔗  Connecting to MongoDB: ${safeUri}`);

        const conn = await mongoose.connect(uri, {
            autoIndex: true,
        });

        console.log(`✅  MongoDB Connected: ${conn.connection.host}  →  DB: "${conn.connection.name}"`);
    } catch (error) {
        console.error('');
        console.error('❌  MongoDB Connection Failed!');
        console.error(`    Reason  : ${error.message}`);
        console.error('');
        console.error('    Checklist:');
        console.error('    1. Is your MONGO_URI correct in backend/.env ?');
        console.error('    2. LOCAL   → Is "mongod" service running on port 27017?');
        console.error('    3. ATLAS   → Have you whitelisted your IP in Atlas Network Access?');
        console.error('    4. ATLAS   → Is your username/password correct in the URI?');
        console.error('');
        process.exit(1);
    }
};

module.exports = connectDB;
