const express = require('express');
const { protect, admin, seller } = require('../middleware/auth');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getSellerOrders,
  markOrderAsReceived,
  updateOrderStatusBySeller,
  markAsSent
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
  .get(protect, admin, getAllOrders)
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/seller')
  .get(protect, seller, getSellerOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrder)
  .delete(protect, admin, deleteOrder);

router.route('/:id/receive')
  .put(protect, markOrderAsReceived);

router.route('/:id/sent')
  .put(protect, seller, markAsSent);

router.route('/:id/seller-update')
  .put(protect, seller, updateOrderStatusBySeller);

module.exports = router;