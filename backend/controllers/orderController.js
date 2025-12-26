const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');
const User = require('../models/User');

// @desc      Get all orders
// @route     GET /api/orders
// @access    Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'id name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Get single order
// @route     GET /api/orders/:id
// @access    Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'orderItems.product',
      select: 'name images'
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Make sure user is the order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Create new order
// @route     POST /api/orders
// @access    Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Calculate prices
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

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
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // Validate stock before updating
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} ${product.name} available in stock`
          });
        }

        product.stock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
      }
    }

    // Get user for email
    const user = await User.findById(req.user.id);

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(user, order);
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      data: {
        order,
        message: 'Order created successfully',
        receiptUrl: `/api/receipt/${order._id}/receipt`,
        downloadReceiptUrl: `/api/receipt/${order._id}/receipt?download=true`
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Update order to delivered
// @route     PUT /api/orders/:id
// @access    Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    let statusChanged = false;
    let oldStatus = order.status;

    if (req.body.status && order.status !== req.body.status) {
      order.status = req.body.status;
      statusChanged = true;
    }

    if (req.body.isPaid && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    if (req.body.isDelivered && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send status update email if status changed
    if (statusChanged) {
      try {
        await sendOrderStatusUpdateEmail(order.user, order, order.status);
      } catch (emailError) {
        console.error('Error sending order status update email:', emailError);
        // Don't fail the order update if email fails
      }
    }

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Delete order
// @route     DELETE /api/orders/:id
// @access    Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    await order.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Get logged in user orders
// @route     GET /api/orders/myorders
// @access    Private
exports.getMyOrders = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};