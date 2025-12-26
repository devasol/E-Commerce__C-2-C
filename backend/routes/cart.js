const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  checkout
} = require('../controllers/cartController');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .put(protect, updateCart)
  .delete(protect, clearCart);

router.route('/item/:productId')
  .put(protect, removeFromCart);

router.route('/checkout')
  .post(protect, checkout);

module.exports = router;