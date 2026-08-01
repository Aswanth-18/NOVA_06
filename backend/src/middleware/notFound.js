/**
 * @file notFound.js
 * @description 404 middleware for unmatched routes.
 * Must be registered AFTER all valid routes but BEFORE errorHandler.
 */

const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = notFound;
