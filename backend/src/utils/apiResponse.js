/**
 * @file apiResponse.js
 * @description Utility helpers for sending consistent JSON API responses.
 */

/**
 * Send a 2xx success response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} [data]
 * @param {object} [meta]  - Optional pagination / extra metadata
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
    const body = { success: true, message };
    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;
    return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 * Prefer using next(error) + errorHandler for most cases.
 * Use this helper only for simple, predictable client errors.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Array} [errors]
 */
const sendError = (res, statusCode = 500, message = 'Error', errors = null) => {
    const body = { success: false, message };
    if (errors !== null) body.errors = errors;
    return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
