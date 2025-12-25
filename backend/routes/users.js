const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { getAllUsers, getUserById, updateUser, deleteUser, createUser } = require('../controllers/userController');

const router = express.Router();

// Requiring controllers
router.route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;