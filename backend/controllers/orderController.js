const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../utils/sendEmail');
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
      select: 'name images seller'  // Include seller information
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Make sure user is the order owner, a seller of products in the order, or admin
    const isOrderOwner = order.user._id.toString() === req.user.id;
    const isSellerOfOrder = order.orderItems.some(item =>
      item.product && item.product.seller &&
      item.product.seller.toString() === req.user.id
    );
    const isAdmin = req.user.role === 'admin';

    if (!isOrderOwner && !isSellerOfOrder && !isAdmin) {
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

    // Create order - don't mark as paid initially for card payments, they will be handled by webhook
    const order = await Order.create({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'cash on delivery' || paymentMethod === 'mobile banking' || paymentMethod === 'internal', // Mark as paid for COD, mobile banking, and internal payments
      paidAt: paymentMethod === 'cash on delivery' || paymentMethod === 'mobile banking' || paymentMethod === 'internal' ? Date.now() : undefined
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

    // Send order confirmation email for non-card payments only.
    // For card payments we will send the confirmation after the payment is completed.
    if (order.paymentMethod && order.paymentMethod !== 'card') {
      try {
        await sendOrderConfirmationEmail(user, order);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order creation if email fails
      }
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

// @desc      Get seller orders
// @route     GET /api/orders/seller
// @access    Private/Seller
exports.getSellerOrders = async (req, res, next) => {
  try {
    // Check if user is authenticated and is a seller
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    // Find products belonging to the seller
    const products = await Product.find({ seller: req.user.id });
    const productIds = products.map(p => p._id);

    // Find orders that contain the seller's products, sorted by newest first
    const orders = await Order.find({
      'orderItems.product': { $in: productIds }
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 }); // Sort by newest first

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

// @desc      Update order to mark as received by buyer
// @route     PUT /api/orders/:id/receive
// @access    Private
exports.markOrderAsReceived = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Make sure user is the order owner
    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Check if order is already marked as delivered
    if (order.isDelivered) {
      return res.status(400).json({
        success: false,
        message: 'Order is already marked as delivered'
      });
    }

    // Update order status to delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    // Send status update email to user
    try {
      await sendOrderStatusUpdateEmail(order.user, order, 'delivered');
    } catch (emailError) {
      console.error('Error sending order status update email:', emailError);
      // Don't fail the order update if email fails
    }

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error marking order as received:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Update order status by seller
// @route     PUT /api/orders/:id/seller-update
// @access    Private/Seller
exports.updateOrderStatusBySeller = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'sent', 'delivered', 'received', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'seller');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Check if the seller is authorized to update this order
    // Check if any of the products in the order belong to this seller
    const isSellerAuthorized = order.orderItems.some(item =>
      item.product.seller.toString() === req.user.id
    );

    if (!isSellerAuthorized && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Allow sellers to mark orders as delivered, but only if the order is already shipped or sent
    if (status === 'delivered' && order.status !== 'shipped' && order.status !== 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark order as delivered. Order must be shipped or sent first.'
      });
    }

    // Update order status
    order.status = status;

    if (status === 'sent') {
      order.isSent = true;
      order.sentAt = Date.now();
    }

    if (status === 'received') {
      order.isReceived = true;
      order.receivedAt = Date.now();
    }


    const updatedOrder = await order.save();

    // Send status update email to user
    try {
      await sendOrderStatusUpdateEmail(order.user, order, status);
    } catch (emailError) {
      console.error('Error sending order status update email:', emailError);
      // Don't fail the order update if email fails
    }

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status by seller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
exports.markAsSent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Make sure user is a seller of one of the products in the order
    const isSellerOfOrder = order.orderItems.some(item =>
      item.product && item.product.seller &&
      item.product.seller.toString() === req.user.id
    );

    if (!isSellerOfOrder && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.isSent = true;
    order.sentAt = Date.now();
    order.status = 'sent';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}