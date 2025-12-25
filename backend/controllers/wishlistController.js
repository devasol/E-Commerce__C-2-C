const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get wishlist
// @route     GET /api/wishlist
// @access    Private
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name price images'
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          items: []
        }
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Add to wishlist
// @route     POST /api/wishlist
// @access    Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id });
    }

    // Check if product already in wishlist
    const existingItemIndex = wishlist.items.findIndex(item =>
      item.product.toString() === productId
    );

    if (existingItemIndex === -1) {
      // Add new item to wishlist
      wishlist.items.push({
        product: productId
      });
    }

    await wishlist.save();

    // Populate the wishlist with product details
    await wishlist.populate({
      path: 'items.product',
      select: 'name price images'
    });

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Remove from wishlist
// @route     DELETE /api/wishlist/:productId
// @access    Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const itemIndex = wishlist.items.findIndex(item =>
      item.product.toString() === productId
    );

    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1);
    } else {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    await wishlist.save();

    // Populate the wishlist with product details
    await wishlist.populate({
      path: 'items.product',
      select: 'name price images'
    });

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Clear wishlist
// @route     DELETE /api/wishlist
// @access    Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};