/**
 * @file roles.js
 * @description Role definitions and permission registry for SkillSync.
 *
 * Single source of truth — import this wherever roles are referenced
 * to avoid magic strings and typos across the codebase.
 */

// ─── Role Constants ───────────────────────────────────────────────────────────

const ROLES = Object.freeze({
    STUDENT: 'student',
    MENTOR: 'mentor',
    FACULTY: 'faculty',
    ADMIN: 'admin',
});

// ─── Role Hierarchy (higher index = more privilege) ───────────────────────────

const ROLE_HIERARCHY = [
    ROLES.STUDENT,
    ROLES.MENTOR,
    ROLES.FACULTY,
    ROLES.ADMIN,
];

// ─── Permission Map ───────────────────────────────────────────────────────────
// Documents which roles are allowed for each action across the system.
// Used for reference and future dynamic permission checks.

const PERMISSIONS = Object.freeze({

    // ── Dashboard ─────────────────────────────────────────────────────────────
    VIEW_DASHBOARD: [ROLES.STUDENT, ROLES.MENTOR, ROLES.FACULTY, ROLES.ADMIN],

    // ── Skills ────────────────────────────────────────────────────────────────
    VIEW_SKILLS: [ROLES.STUDENT, ROLES.MENTOR, ROLES.FACULTY, ROLES.ADMIN],
    CREATE_SKILL: [ROLES.FACULTY, ROLES.ADMIN],
    EDIT_SKILL: [ROLES.FACULTY, ROLES.ADMIN],
    DELETE_SKILL: [ROLES.FACULTY, ROLES.ADMIN],

    // ── Bookings ──────────────────────────────────────────────────────────────
    CREATE_BOOKING: [ROLES.STUDENT],
    VIEW_BOOKINGS: [ROLES.STUDENT, ROLES.MENTOR],

    // ── Mentor Module ─────────────────────────────────────────────────────────
    APPLY_AS_MENTOR: [ROLES.STUDENT],
    VIEW_MENTOR_APPLICATIONS: [ROLES.FACULTY, ROLES.ADMIN],
    APPROVE_MENTOR: [ROLES.FACULTY],
    ACCEPT_REJECT_SESSION: [ROLES.MENTOR],
    MANAGE_AVAILABILITY: [ROLES.MENTOR],
    VIEW_ASSIGNED_STUDENTS: [ROLES.MENTOR],

    // ── User Management ───────────────────────────────────────────────────────
    UPDATE_OWN_PROFILE: [ROLES.STUDENT, ROLES.MENTOR, ROLES.FACULTY, ROLES.ADMIN],
    VIEW_LEADERBOARD: [ROLES.STUDENT, ROLES.MENTOR, ROLES.FACULTY, ROLES.ADMIN],
    MANAGE_USERS: [ROLES.ADMIN],
    MANAGE_DEPARTMENTS: [ROLES.ADMIN],

    // ── Faculty / Reporting ───────────────────────────────────────────────────
    VIEW_DEPARTMENT_REPORTS: [ROLES.FACULTY, ROLES.ADMIN],
    PUBLISH_ANNOUNCEMENTS: [ROLES.FACULTY, ROLES.ADMIN],
    MANAGE_ANNOUNCEMENTS: [ROLES.ADMIN],

    // ── Analytics ─────────────────────────────────────────────────────────────
    VIEW_ANALYTICS: [ROLES.ADMIN],
});

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = { ROLES, ROLE_HIERARCHY, PERMISSIONS };
