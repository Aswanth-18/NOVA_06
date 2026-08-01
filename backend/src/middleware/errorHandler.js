/**
 * @file errorHandler.js
 * @description Global error-handling middleware.
 * Must be registered LAST in the Express middleware chain.
 */

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `A record with that ${field} already exists.`,
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors: messages,
        });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid value for field: ${err.path}`,
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token has expired.' });
    }

    // CORS policy error
    if (err.message && err.message.startsWith('CORS policy')) {
        return res.status(403).json({ success: false, message: err.message });
    }

    // Default server error
    const statusCode = err.statusCode || err.status || 500;
    const message =
        process.env.NODE_ENV === 'production' && statusCode === 500
            ? 'Internal Server Error'
            : err.message || 'Internal Server Error';

    console.error(`[ErrorHandler] ${statusCode} - ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    return res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
