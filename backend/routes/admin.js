const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

router.route('/dashboard')
  .get(protect, admin, getDashboardStats);

module.exports = router;