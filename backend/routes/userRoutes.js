const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router; 