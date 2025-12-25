const express = require('express');
const { protect, admin, seller } = require('../middleware/auth');
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsBySeller 
} = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(getAllProducts)
  .post(protect, seller, createProduct);

router.route('/seller/:id')
  .get(protect, getProductsBySeller);

router.route('/:id')
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

module.exports = router;