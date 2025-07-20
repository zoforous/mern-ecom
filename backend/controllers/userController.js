const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort('-createdAt');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent admin from removing their own admin status
    if (user._id.toString() === req.user._id.toString() && !req.body.isAdmin) {
      res.status(400);
      throw new Error('Admin cannot remove their own admin status');
    }

    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Admin cannot delete themselves');
    }

    // Prevent deleting other admins
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin users');
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
}; 