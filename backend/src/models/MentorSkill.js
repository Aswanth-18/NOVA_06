/**
 * @file MentorSkill.js
 * @description Per-skill mentor verification model for SkillSync.
 *
 * Each record represents ONE user's application to teach ONE specific skill.
 * Faculty approves or rejects each MentorSkill individually.
 *
 * A user is a verified mentor for a skill ONLY when status === 'approved'.
 */

const mongoose = require('mongoose');

const mentorSkillSchema = new mongoose.Schema(
    {
        // The user who wants to teach this skill
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required.'],
        },

        // Denormalized skill name for fast queries (no join needed)
        skillName: {
            type: String,
            required: [true, 'Skill name is required.'],
            trim: true,
        },

        // Optional reference to the Skill document
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            default: null,
        },

        // Score from the assessment (raw number)
        assessmentScore: {
            type: Number,
            required: [true, 'Assessment score is required.'],
            min: 0,
        },

        // Total questions in the assessment
        totalQuestions: {
            type: Number,
            default: 20,
        },

        // Per-skill verification status
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'rejected'],
                message: 'Status must be pending, approved, or rejected.',
            },
            default: 'pending',
        },

        // Faculty member who reviewed this application
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        // When the faculty reviewed this
        approvedAt: {
            type: Date,
            default: null,
        },

        // Reason for rejection (optional)
        rejectionReason: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Fast lookup: all skills for a user
mentorSkillSchema.index({ userId: 1 });

// Fast lookup: all approved mentors for a skill
mentorSkillSchema.index({ skillName: 1, status: 1 });

// Prevent duplicate pending/approved applications for same user+skill
mentorSkillSchema.index({ userId: 1, skillName: 1, status: 1 });

// ─── Model Export ─────────────────────────────────────────────────────────────

const MentorSkill = mongoose.models.MentorSkill || mongoose.model('MentorSkill', mentorSkillSchema);

module.exports = MentorSkill;
