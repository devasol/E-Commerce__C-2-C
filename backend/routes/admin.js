const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getSalesReport,
  getTopProducts,
  getRecentOrders
} = require('../controllers/adminController');

const router = express.Router();

router.route('/dashboard')
  .get(protect, admin, getDashboardStats);

router.route('/reports/sales')
  .get(protect, admin, getSalesReport);

router.route('/reports/top-products')
  .get(protect, admin, getTopProducts);

router.route('/reports/recent-orders')
  .get(protect, admin, getRecentOrders);

module.exports = router;