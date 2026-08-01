/**
 * @file User.js
 * @description Mongoose User model for SkillSync.
 *
 * Fields:
 *  fullName, registerNumber, email, password (hashed),
 *  department, year, role, profileImage, isVerifiedMentor, createdAt
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Schema Definition ────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required.'],
            trim: true,
            minlength: [2, 'Full name must be at least 2 characters.'],
            maxlength: [100, 'Full name cannot exceed 100 characters.'],
        },

        registerNumber: {
            type: String,
            required: [true, 'Register number is required.'],
            unique: true,
            trim: true,
            uppercase: true,
            match: [
                /^[A-Z0-9]{4,20}$/,
                'Register number must be 4–20 alphanumeric characters.',
            ],
        },

        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                'Please provide a valid email address.',
            ],
        },

        password: {
            type: String,
            required: [true, 'Password is required.'],
            minlength: [6, 'Password must be at least 6 characters.'],
            select: false, // Excluded from query results by default
        },

        department: {
            type: String,
            required: [true, 'Department is required.'],
            trim: true,
            enum: {
                values: [
                    'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL',
                    'AIDS', 'AIML', 'CSD', 'CSBS', 'OTHER',
                ],
                message: '{VALUE} is not a supported department.',
            },
        },

        year: {
            type: Number,
            required: [true, 'Year is required.'],
            min: [1, 'Year must be between 1 and 4.'],
            max: [4, 'Year must be between 1 and 4.'],
        },

        role: {
            type: String,
            enum: {
                values: ['user', 'faculty', 'admin'],
                message: 'Role must be user, faculty, or admin.',
            },
            default: 'user',
        },

        profileImage: {
            type: String,
            default: '',
        },

        isVerifiedMentor: {
            type: Boolean,
            default: false,
        },

        skillsTeaching: [
            {
                type: String,
                trim: true,
            },
        ],

        skillsLearning: [
            {
                type: String,
                trim: true,
            },
        ],

        xp: {
            type: Number,
            default: 100,
        },

        level: {
            type: Number,
            default: 1,
        },

        badge: {
            type: String,
            default: 'Beginner',
        },

        badges: [
            {
                type: String,
                default: 'Beginner',
            },
        ],

        completedSessionsCount: {
            type: Number,
            default: 0,
        },

        completedSessions: {
            type: Number,
            default: 0,
        },

        mentorRating: {
            type: Number,
            default: 4.8,
        },

        rating: {
            type: Number,
            default: 4.8,
        },

        availability: {
            type: Array,
            default: [],
        },
    },
    {
        // Automatically manages createdAt and updatedAt
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Compound text index for search features (future use)
userSchema.index({ fullName: 'text', department: 'text' });

// ─── Pre-Save Hook: Hash Password ─────────────────────────────────────────────

/**
 * Hashes the password with bcrypt before saving.
 * Only runs when the password field is new or modified.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12); // 12 rounds — good balance of security/speed
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ─── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Compares a plain-text candidate password against the stored hash.
 *
 * @param  {string} candidatePassword - The password submitted by the user
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Returns a safe user object (strips password and internal fields).
 * Use this before sending user data in API responses.
 *
 * @returns {object}
 */
userSchema.methods.toPublicJSON = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        registerNumber: this.registerNumber,
        email: this.email,
        department: this.department,
        year: this.year,
        role: this.role,
        profileImage: this.profileImage,
        isVerifiedMentor: this.isVerifiedMentor,
        skillsTeaching: this.skillsTeaching || [],
        skillsLearning: this.skillsLearning || [],
        xp: this.xp || 100,
        level: this.level || 1,
        badge: this.badge || 'Beginner',
        badges: this.badges || ['Beginner'],
        completedSessions: this.completedSessions || this.completedSessionsCount || 0,
        mentorRating: this.mentorRating || this.rating || 4.8,
        availability: this.availability || [],
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

// ─── Mentor Application Schema ────────────────────────────────────────────────
const mentorApplicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            default: 20,
        },
        skillsTeaching: [
            {
                type: String,
                trim: true,
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'failed'],
            default: 'pending',
        },
        lastAttemptAt: {
            type: Date,
            default: Date.now,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: Date,
    },
    {
        timestamps: true,
    }
);

// ─── Message Schema ───────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Message content is required.'],
            trim: true,
        },
        messageType: {
            type: String,
            enum: ['text', 'emoji', 'file'],
            default: 'text',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Achievement Schema ───────────────────────────────────────────────────────
const achievementSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        xpReward: { type: Number, default: 50 },
        icon: { type: String, default: 'Award' },
        category: { type: String, default: 'learning' },
    },
    { timestamps: true }
);

// ─── Badge Schema ─────────────────────────────────────────────────────────────
const badgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: 'Shield' },
        minXp: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// ─── Model Export ──────────────────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model('User', userSchema);
const MentorApplication = mongoose.models.MentorApplication || mongoose.model('MentorApplication', mentorApplicationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);
const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);

module.exports = User;
module.exports.MentorApplication = MentorApplication;
module.exports.Message = Message;
module.exports.Achievement = Achievement;
module.exports.Badge = Badge;
