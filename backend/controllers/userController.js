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

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const newAddress = {
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    country: req.body.country,
    isDefault: req.body.isDefault || false
  };

  // If this is the first address or isDefault is true, make it the default
  if (user.addresses.length === 0 || newAddress.isDefault) {
    // Set all existing addresses to non-default
    user.addresses.forEach(addr => addr.isDefault = false);
    newAddress.isDefault = true;
  }

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json(user);
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.addressId;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  address.street = req.body.street || address.street;
  address.city = req.body.city || address.city;
  address.state = req.body.state || address.state;
  address.zipCode = req.body.zipCode || address.zipCode;
  address.country = req.body.country || address.country;

  // Handle default address setting
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
  }

  await user.save();
  res.json(user);
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.addressId;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if address exists
  const addressExists = user.addresses.id(addressId);
  if (!addressExists) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Remove address using pull
  user.addresses.pull({ _id: addressId });
  await user.save();

  res.json(user);
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.addressId;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Set all addresses to non-default
  user.addresses.forEach(addr => addr.isDefault = false);
  // Set the selected address as default
  address.isDefault = true;

  await user.save();
  res.json(user);
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}; 