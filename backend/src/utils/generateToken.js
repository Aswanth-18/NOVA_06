/**
 * @file generateToken.js
 * @description Utility to sign and return a JWT.
 */

const jwt = require('jsonwebtoken');

/**
 * Signs a JWT with the given payload.
 *
 * @param {object} payload  - Data to encode (e.g., { id, role })
 * @returns {string}        - Signed JWT string
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

module.exports = generateToken;
