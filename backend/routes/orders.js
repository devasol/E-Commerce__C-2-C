const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  deleteOrder,
  getMyOrders
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
  .get(protect, admin, getAllOrders)
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrder)
  .delete(protect, admin, deleteOrder);

module.exports = router;