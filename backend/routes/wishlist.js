const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist)
  .delete(protect, clearWishlist);

router.route('/:productId')
  .delete(protect, removeFromWishlist);

module.exports = router;