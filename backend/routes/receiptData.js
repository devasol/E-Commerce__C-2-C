const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc      Get order receipt data for display
// @route     GET /api/receipt/:orderId/data
// @access    Private
router.route('/:orderId/data').get(protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.orderId}`
      });
    }

    // Make sure user is the order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    // Format the receipt data for display
    const receiptData = {
      orderId: order._id,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      orderItems: order.orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: (item.price * item.quantity).toFixed(2)
      })),
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      paidAt: order.paidAt ? new Date(order.paidAt).toLocaleString() : null,
      paymentResult: order.paymentResult
    };

    res.status(200).json({
      success: true,
      data: receiptData
    });
  } catch (error) {
    console.error('Error fetching receipt data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt data'
    });
  }
});

module.exports = router;