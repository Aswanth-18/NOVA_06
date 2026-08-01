/**
 * @file Skill.js
 * @description Mongoose Skill model for SkillSync.
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
    {
        skillName: {
            type: String,
            required: [true, 'Skill name is required'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        difficulty: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to keep status and isActive synchronized
skillSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.isActive = this.status === 'Active';
    } else if (this.isModified('isActive')) {
        this.status = this.isActive ? 'Active' : 'Inactive';
    }
    next();
});

module.exports = mongoose.model('Skill', skillSchema);
