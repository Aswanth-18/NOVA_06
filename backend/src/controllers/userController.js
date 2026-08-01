/**
 * @file userController.js
 * @description User controller — placeholder functions.
 */

const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route  GET /api/v1/users
 * @access Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    // TODO: Fetch all users with pagination & filters
    sendSuccess(res, 200, 'GetAllUsers endpoint ready.', []);
});

/**
 * @route  GET /api/v1/users/:id
 * @access Private
 */
const getUserById = asyncHandler(async (req, res) => {
    // TODO: Fetch a single user by ID
    sendSuccess(res, 200, 'GetUserById endpoint ready.', { id: req.params.id });
});

/**
 * @route  PUT /api/v1/users/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
    // TODO: Update user profile fields
    sendSuccess(res, 200, 'UpdateUser endpoint ready.', { id: req.params.id });
});

/**
 * @route  DELETE /api/v1/users/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    // TODO: Soft-delete or permanently remove a user
    sendSuccess(res, 200, 'DeleteUser endpoint ready.', { id: req.params.id });
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
