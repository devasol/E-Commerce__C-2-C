const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');

const router = express.Router();

// @desc      Checkout from cart (browser version with redirect)
// @route     POST /api/checkout/browser
// @access    Private
router.route('/browser').post(protect, async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name price images stock sold'
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock for all items in cart
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${item.product.stock} ${item.product.name} available in stock`
        });
      }
    }

    // Calculate prices
    const itemsPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxPrice = parseFloat((itemsPrice * 0.15).toFixed(2)); // 15% tax
    const shippingPrice = 0; // Free shipping for now, can be calculated based on location
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order items array
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images ? item.product.images[0] : null
    }));

    // Create order
    const order = await Order.create({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'cash on delivery' || paymentMethod === 'mobile banking', // Mark as paid for COD and mobile banking
      paidAt: paymentMethod === 'cash on delivery' || paymentMethod === 'mobile banking' ? Date.now() : undefined
    });

    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
      }
    }

    // Clear the cart after successful order creation
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    // Send order confirmation email
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (user) {
      try {
        await sendOrderConfirmationEmail(user, order);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order creation if email fails
      }
    }

    // Redirect to success page with order ID for receipt download
    res.redirect(`/api/messages?type=success&message=Your+order+was+placed+successfully&orderId=${order._id}`);
  } catch (error) {
    console.error('Browser checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing checkout'
    });
  }
});

module.exports = router;