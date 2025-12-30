const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
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

    // Check if payment method is TeleBirr and handle accordingly
    let user = null;
    if (paymentMethod === 'telebirr') {
      // For demo TeleBirr, we don't need to check account balance
      // In a real implementation, you would verify the payment with TeleBirr API
    }

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
      isPaid: paymentMethod === 'telebirr', // Only mark as paid for TeleBirr payments
      paidAt: paymentMethod === 'telebirr' ? Date.now() : undefined
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
    const orderUser = await User.findById(req.user.id);
    if (orderUser) {
      try {
        await sendOrderConfirmationEmail(orderUser, order);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order creation if email fails
      }
    }

    // Redirect to the frontend payment page with order details
    res.redirect(`/telebirr-payment-demo?orderId=${order._id}&amount=${order.totalPrice}`);
  } catch (error) {
    console.error('Browser checkout error:', error);
    // Redirect to an error message page, but on the frontend
    res.redirect(`/payment-error?message=${encodeURIComponent(error.message || 'Error processing checkout')}`);
  }
});

module.exports = router;