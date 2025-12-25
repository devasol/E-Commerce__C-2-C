const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  getCart, 
  addToCart, 
  updateCart, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .put(protect, updateCart)
  .delete(protect, clearCart);

router.route('/item/:productId')
  .put(protect, removeFromCart);

module.exports = router;