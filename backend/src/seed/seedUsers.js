/**
 * @file seedUsers.js
 * @description SkillSync User Seeding Module
 * Seeds only the specific required users into the MongoDB Atlas database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB.');

        // User Data exactly as requested
        // Note: Department mapped to enum ('CSE') and year mapped to Number (3, 4)
        // Note: Register numbers added for Faculty/Admin to pass schema validation
        const usersToSeed = [
            {
                fullName: 'Aswanth',
                registerNumber: '7376241CS134',
                email: 'student@skillsync.com',
                password: 'Student@123',
                department: 'CSE',
                year: 3,
                role: 'student',
                isVerifiedMentor: false,
            },
            {
                fullName: 'Rahul Kumar',
                registerNumber: '7376241CS101',
                email: 'mentor@skillsync.com',
                password: 'Mentor@123',
                department: 'CSE',
                year: 4,
                role: 'mentor',
                isVerifiedMentor: true,
            },
            {
                fullName: 'Dr. Priya R',
                registerNumber: 'FAC001',
                email: 'faculty@skillsync.com',
                password: 'Faculty@123',
                department: 'CSE',
                year: 4, // Required by schema
                role: 'faculty',
                isVerifiedMentor: false,
            },
            {
                fullName: 'System Administrator',
                registerNumber: 'ADM001',
                email: 'admin@skillsync.com',
                password: 'Admin@123',
                department: 'OTHER', // Required by schema
                year: 4, // Required by schema
                role: 'admin',
                isVerifiedMentor: false,
            },
        ];

        let insertedCount = 0;
        let skippedCount = 0;

        for (const userData of usersToSeed) {
            // Check if user already exists
            const exists = await User.findOne({ email: userData.email });

            if (exists) {
                console.log(`Users already exist: ${userData.email}`);
                skippedCount++;
            } else {
                // Password hashing is handled automatically by the User schema's pre('save') hook.
                await User.create(userData);
                console.log(`✅ Successfully inserted: ${userData.email} (${userData.role})`);
                insertedCount++;
            }
        }

        console.log('\n--- Seeding Summary ---');
        console.log(`Total Inserted: ${insertedCount}`);
        console.log(`Total Skipped: ${skippedCount}\n`);

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed.');
        process.exit(0);
    }
};

seedUsers();
