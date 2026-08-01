/**
 * @file skillController.js
 * @description Skill Management Controller
 * Handles CRUD operations for skills with role-based restrictions and field validation.
 *
 * Valid roles: user | faculty | admin
 * (No 'student' or 'mentor' roles exist — everyone is a 'user')
 */

const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @route   GET /api/v1/skills
 * @access  All authenticated roles
 * @desc    Return skills list. Users see active skills only; Faculty/Admin see all.
 */
const getAllSkills = asyncHandler(async (req, res) => {
    const filter = {};

    // Regular users can only view active skills
    if (req.user && req.user.role === 'user') {
        filter.isActive = true;
    } else if (req.query.status) {
        if (req.query.status === 'Active') filter.isActive = true;
        if (req.query.status === 'Inactive') filter.isActive = false;
    }

    if (req.query.category && req.query.category !== 'All') {
        filter.category = req.query.category;
    }

    if (req.query.search) {
        filter.skillName = { $regex: req.query.search, $options: 'i' };
    }

    const skills = await Skill.find(filter)
        .populate('createdBy', 'fullName email role')
        .sort('-createdAt');

    sendSuccess(res, 200, 'Skills retrieved successfully', skills);
});

/**
 * @route   GET /api/v1/skills/:id
 * @access  All authenticated roles
 * @desc    Get details of a single skill by its ID.
 */
const getSkillById = asyncHandler(async (req, res) => {
    const skillId = req.params.id;
    const skill = await Skill.findById(skillId).populate('createdBy', 'fullName email role');

    if (!skill) {
        return sendError(res, 404, 'Skill not found');
    }

    // Regular users cannot see inactive skills
    if (req.user && req.user.role === 'user' && !skill.isActive) {
        return sendError(res, 404, 'Skill not found');
    }

    sendSuccess(res, 200, 'Skill retrieved successfully', skill);
});

/**
 * @route   POST /api/v1/skills
 * @access  Faculty, Admin
 * @desc    Create a new skill.
 */
const createSkill = asyncHandler(async (req, res) => {
    const { skillName, category, description, difficulty, status } = req.body;

    if (!skillName || !skillName.trim()) {
        return sendError(res, 400, 'Skill Name is required');
    }

    if (!category || !category.trim()) {
        return sendError(res, 400, 'Category is required');
    }

    // Check for duplicate skill (case-insensitive)
    const existingSkill = await Skill.findOne({
        skillName: { $regex: new RegExp(`^${skillName.trim()}$`, 'i') },
    });

    if (existingSkill) {
        return sendError(res, 409, 'A skill with this name already exists');
    }

    const newSkill = await Skill.create({
        skillName: skillName.trim(),
        category: category.trim(),
        description: description ? description.trim() : '',
        difficulty: difficulty || 'Beginner',
        status: status || 'Active',
        isActive: status ? status === 'Active' : true,
        createdBy: req.user._id,
    });

    const populatedSkill = await Skill.findById(newSkill._id).populate('createdBy', 'fullName email role');

    sendSuccess(res, 201, 'Skill created successfully', populatedSkill);
});

/**
 * @route   PUT /api/v1/skills/:id
 * @access  Faculty, Admin
 * @desc    Update skill information.
 */
const updateSkill = asyncHandler(async (req, res) => {
    const skillId = req.params.id;
    const { skillName, category, description, difficulty, status, isActive } = req.body;

    const skill = await Skill.findById(skillId);

    if (!skill) {
        return sendError(res, 404, 'Skill not found');
    }

    // Check duplicate if skillName is updated
    if (skillName && skillName.trim().toLowerCase() !== skill.skillName.toLowerCase()) {
        const existing = await Skill.findOne({
            skillName: { $regex: new RegExp(`^${skillName.trim()}$`, 'i') },
        });
        if (existing) {
            return sendError(res, 409, 'A skill with this name already exists');
        }
        skill.skillName = skillName.trim();
    }

    if (category) skill.category = category.trim();
    if (description !== undefined) skill.description = description.trim();
    if (difficulty) skill.difficulty = difficulty;

    if (status !== undefined) {
        skill.status = status;
        skill.isActive = status === 'Active';
    } else if (isActive !== undefined) {
        skill.isActive = isActive;
        skill.status = isActive ? 'Active' : 'Inactive';
    }

    const updatedSkill = await skill.save();
    const populatedSkill = await Skill.findById(updatedSkill._id).populate('createdBy', 'fullName email role');

    sendSuccess(res, 200, 'Skill updated successfully', populatedSkill);
});

/**
 * @route   DELETE /api/v1/skills/:id
 * @access  Faculty, Admin
 * @desc    Delete a skill document.
 */
const deleteSkill = asyncHandler(async (req, res) => {
    const skillId = req.params.id;

    const skill = await Skill.findById(skillId);

    if (!skill) {
        return sendError(res, 404, 'Skill not found');
    }

    await Skill.findByIdAndDelete(skillId);

    sendSuccess(res, 200, 'Skill deleted successfully', { id: skillId });
});

module.exports = {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
};
