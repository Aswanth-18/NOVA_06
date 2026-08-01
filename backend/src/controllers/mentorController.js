/**
 * @file mentorController.js
 * @description Per-skill mentor verification controller.
 *
 * Architecture:
 *  - Each user can apply to teach specific skills
 *  - Faculty approves/rejects ONE MentorSkill at a time
 *  - A user is a verified mentor only for their APPROVED skills
 *  - Booking validation checks MentorSkill approval for the booked skill
 */

const User = require('../models/User');
const MentorSkill = require('../models/MentorSkill');
const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── Helper ────────────────────────────────────────────────────────────────────
/**
 * Sync isVerifiedMentor boolean on User based on whether they have any approved MentorSkills.
 * This is a convenience cache so existing code that checks isVerifiedMentor still works.
 */
async function syncVerifiedMentorFlag(userId) {
    const approvedCount = await MentorSkill.countDocuments({ userId, status: 'approved' });
    await User.findByIdAndUpdate(userId, { isVerifiedMentor: approvedCount > 0 });
}

// ─── 1. Get Current User's Mentor Status ──────────────────────────────────────
/**
 * @route   GET /api/v1/mentor/my-status
 * @access  Private — All authenticated
 * @desc    Returns per-skill MentorSkill records for the current user.
 */
const getStudentStatus = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const mentorSkills = await MentorSkill.find({ userId })
        .sort('-createdAt');

    const hasPending = mentorSkills.some(ms => ms.status === 'pending');
    const hasApproved = mentorSkills.some(ms => ms.status === 'approved');

    // Check 24-hour retake cooldown (based on most recent rejected record)
    const lastRejected = mentorSkills
        .filter(ms => ms.status === 'rejected')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    let canRetake = true;
    let hoursRemaining = 0;

    if (lastRejected) {
        const hoursPassed = (Date.now() - new Date(lastRejected.updatedAt)) / (1000 * 60 * 60);
        canRetake = hoursPassed >= 24;
        hoursRemaining = Math.max(0, Math.ceil(24 - hoursPassed));
    }

    sendSuccess(res, 200, 'Mentor skill status retrieved.', {
        mentorSkills,
        hasPending,
        hasApproved,
        canApply: !hasPending && canRetake,
        canRetake,
        hoursRemaining,
    });
});

// ─── 2. Get Current User's Approved Teaching Skills ───────────────────────────
/**
 * @route   GET /api/v1/mentor/my-skills
 * @access  Private — All authenticated
 * @desc    Returns only APPROVED MentorSkill records for the current user.
 */
const getMyMentorSkills = asyncHandler(async (req, res) => {
    const approvedSkills = await MentorSkill.find({
        userId: req.user._id,
        status: 'approved',
    }).sort('skillName');

    sendSuccess(res, 200, 'Approved teaching skills retrieved.', approvedSkills);
});

// ─── 3. Apply to Teach Skills (Post Assessment) ───────────────────────────────
/**
 * @route   POST /api/v1/mentor/apply
 * @access  Private — user, faculty, admin
 * @desc    Submit mentor assessment results.
 *          Creates one MentorSkill record per selected skill.
 *          Payload: { score: number, totalQuestions: number, skills: string[] }
 */
const applyAsMentor = asyncHandler(async (req, res) => {
    const { score, totalQuestions = 20, skills = [], skillsTeaching = [] } = req.body;

    if (score === undefined || score === null || isNaN(score)) {
        return sendError(res, 400, 'Assessment score is required.');
    }

    const numericScore = Number(score);
    const scorePercentage = (numericScore / totalQuestions) * 100;
    const selectedSkills = [...new Set([
        ...(Array.isArray(skills) ? skills : []),
        ...(Array.isArray(skillsTeaching) ? skillsTeaching : []),
    ])].filter(Boolean);

    if (selectedSkills.length === 0) {
        return sendError(res, 400, 'Please select at least one skill to teach.');
    }

    // Check if user has any PENDING applications for any of the selected skills
    const pendingForSkills = await MentorSkill.find({
        userId: req.user._id,
        skillName: { $in: selectedSkills },
        status: 'pending',
    });

    if (pendingForSkills.length > 0) {
        const pendingNames = pendingForSkills.map(ms => ms.skillName).join(', ');
        return sendError(res, 400, `You already have pending applications for: ${pendingNames}. Wait for faculty review.`);
    }

    // Check 24-hour cooldown for recently rejected skills
    const recentlyRejected = await MentorSkill.find({
        userId: req.user._id,
        skillName: { $in: selectedSkills },
        status: 'rejected',
    });

    const stillCoolingDown = recentlyRejected.filter(ms => {
        const hoursPassed = (Date.now() - new Date(ms.updatedAt)) / (1000 * 60 * 60);
        return hoursPassed < 24;
    });

    if (stillCoolingDown.length > 0) {
        const names = stillCoolingDown.map(ms => ms.skillName).join(', ');
        return sendError(res, 400, `Please wait 24 hours before reapplying for: ${names}.`);
    }

    // If score below 70%, record as rejected immediately (still per-skill)
    if (scorePercentage < 70) {
        const failedRecords = await MentorSkill.create(
            selectedSkills.map(skillName => ({
                userId: req.user._id,
                skillName,
                assessmentScore: numericScore,
                totalQuestions,
                status: 'rejected',
                rejectionReason: `Assessment score ${numericScore}/${totalQuestions} (${scorePercentage.toFixed(1)}%) is below 70% minimum.`,
            }))
        );

        return sendError(
            res, 400,
            `Assessment Failed! You scored ${numericScore}/${totalQuestions} (${scorePercentage.toFixed(1)}%). Minimum required is 70%. Retake allowed after 24 hours.`
        );
    }

    // Score >= 70% — create pending MentorSkill per skill
    const newRecords = await MentorSkill.create(
        selectedSkills.map(skillName => ({
            userId: req.user._id,
            skillName,
            assessmentScore: numericScore,
            totalQuestions,
            status: 'pending',
        }))
    );

    sendSuccess(
        res, 201,
        `Assessment Passed! ${numericScore}/${totalQuestions} (${scorePercentage.toFixed(1)}%). Applications submitted for: ${selectedSkills.join(', ')}. Pending Faculty Approval.`,
        { mentorSkills: newRecords, selectedSkills }
    );
});

// ─── 4. Get All Mentor Applications (Faculty View) ────────────────────────────
/**
 * @route   GET /api/v1/mentor/applications
 * @access  Private — Faculty, Admin
 * @desc    Returns per-skill MentorSkill records for faculty to review.
 *          Supports filtering by status, skill, department.
 */
const getMentorApplications = asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status && req.query.status !== 'All') {
        filter.status = req.query.status.toLowerCase();
    }

    if (req.query.skill) {
        filter.skillName = { $regex: req.query.skill, $options: 'i' };
    }

    let records = await MentorSkill.find(filter)
        .populate('userId', 'fullName registerNumber department email year')
        .populate('facultyId', 'fullName email')
        .sort('-createdAt');

    // Filter by department if specified
    if (req.query.department && req.query.department !== 'All Departments') {
        records = records.filter(r => r.userId?.department === req.query.department);
    }

    sendSuccess(res, 200, 'Mentor skill applications retrieved.', records);
});

// ─── 5. Approve or Reject a Single MentorSkill ────────────────────────────────
/**
 * @route   PUT /api/v1/mentor/approve/:id
 * @route   POST /api/v1/mentor/approve/:id
 * @access  Private — Faculty, Admin
 * @desc    Faculty approves or rejects ONE MentorSkill record by its _id.
 *          Payload: { action: 'approve' | 'reject', rejectionReason?: string }
 */
const approveMentor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
        return sendError(res, 400, 'Invalid action. Expected "approve" or "reject".');
    }

    const mentorSkill = await MentorSkill.findById(id);

    if (!mentorSkill) {
        return sendError(res, 404, 'Mentor skill application not found.');
    }

    if (mentorSkill.status !== 'pending') {
        return sendError(res, 400, `This application is already ${mentorSkill.status}.`);
    }

    // Apply the decision
    mentorSkill.status = action === 'approve' ? 'approved' : 'rejected';
    mentorSkill.facultyId = req.user._id;
    mentorSkill.approvedAt = new Date();
    if (action === 'reject' && rejectionReason) {
        mentorSkill.rejectionReason = rejectionReason.trim();
    }
    await mentorSkill.save();

    // Sync the isVerifiedMentor convenience flag on User
    await syncVerifiedMentorFlag(mentorSkill.userId);

    const populated = await MentorSkill.findById(id)
        .populate('userId', 'fullName registerNumber department email year')
        .populate('facultyId', 'fullName email');

    const statusWord = action === 'approve' ? 'approved' : 'rejected';
    sendSuccess(
        res, 200,
        `MentorSkill for "${mentorSkill.skillName}" ${statusWord} successfully.`,
        populated
    );
});

// ─── 6. Get Approved Mentors For a Specific Skill ────────────────────────────
/**
 * @route   GET /api/v1/mentor/mentors-for-skill
 * @access  Private — All authenticated
 * @desc    Returns users who have an approved MentorSkill for the given skill.
 *          Query param: ?skill=Java
 */
const getMentorsForSkill = asyncHandler(async (req, res) => {
    const { skill } = req.query;

    if (!skill) {
        return sendError(res, 400, 'skill query parameter is required. e.g. ?skill=Java');
    }

    const approvedRecords = await MentorSkill.find({
        skillName: { $regex: new RegExp(`^${skill.trim()}$`, 'i') },
        status: 'approved',
    }).populate('userId', 'fullName registerNumber department email year mentorRating completedSessionsCount availability');

    // Shape the response as a list of mentor users (deduplicated)
    const mentors = approvedRecords
        .filter(r => r.userId) // guard against deleted users
        .map(r => ({
            mentorSkillId: r._id,
            assessmentScore: r.assessmentScore,
            totalQuestions: r.totalQuestions,
            approvedAt: r.approvedAt,
            ...r.userId.toObject(),
        }));

    sendSuccess(res, 200, `Approved mentors for "${skill}" retrieved.`, mentors);
});

// ─── 7. Get Assigned Students (for a Mentor Teaching view) ───────────────────
/**
 * @route   GET /api/v1/mentor/students
 * @access  Private — verified mentor + admin
 */
const getAssignedStudents = asyncHandler(async (req, res) => {
    const Session = require('../models/Session');

    const sessions = await Session.find({ mentor: req.user._id })
        .populate('student', 'fullName email registerNumber department year profileImage completedSessionsCount rating')
        .sort('-createdAt');

    const studentMap = new Map();
    sessions.forEach(s => {
        if (s.student && !studentMap.has(s.student._id.toString())) {
            studentMap.set(s.student._id.toString(), {
                _id: s.student._id,
                fullName: s.student.fullName,
                email: s.student.email,
                registerNumber: s.student.registerNumber || '',
                department: s.student.department || 'CSE',
                year: s.student.year || 1,
                profileImage: s.student.profileImage || '',
                totalSessions: 1,
                lastSessionDate: s.scheduledDate,
                lastTopic: s.topic,
                lastStatus: s.status,
                bookingId: s._id,
            });
        } else if (s.student) {
            studentMap.get(s.student._id.toString()).totalSessions += 1;
        }
    });

    sendSuccess(res, 200, 'Assigned students retrieved.', Array.from(studentMap.values()));
});

// ─── 8. Update Availability (stub) ────────────────────────────────────────────
const updateAvailability = asyncHandler(async (req, res) => {
    sendSuccess(res, 200, 'Availability schedule updated.', { mentorId: req.user._id });
});

module.exports = {
    getStudentStatus,
    getMyMentorSkills,
    applyAsMentor,
    getMentorApplications,
    approveMentor,
    getMentorsForSkill,
    getAssignedStudents,
    updateAvailability,
};

