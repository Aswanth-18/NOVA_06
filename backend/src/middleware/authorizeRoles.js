/**
 * @file authorizeRoles.js
 * @description Role-based authorization middleware.
 *
 * Valid roles: 'user' | 'faculty' | 'admin'
 * Mentor status is per-skill (MentorSkill collection), NOT a role on User.
 * Admin always bypasses role checks.
 */

/**
 * Reusable middleware to protect routes based on user role.
 * Admins automatically bypass role checks and get full access to every route.
 *
 * @param  {...string} allowedRoles - e.g. "faculty", "admin", "user"
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required before checking roles.',
            });
        }

        // Admin override — full access to every route
        if (req.user.role === 'admin') {
            return next();
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied',
            });
        }

        next();
    };
};

module.exports = authorizeRoles;
