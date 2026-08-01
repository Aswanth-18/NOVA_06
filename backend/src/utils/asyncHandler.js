/**
 * @file asyncHandler.js
 * @description Wraps async route handlers / controller functions to
 * automatically forward errors to Express's next() — eliminating
 * try/catch boilerplate inside every controller.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
