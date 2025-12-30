const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderStatusUpdateEmail, sendOrderConfirmationEmail } = require('../utils/sendEmail');

// @desc      Initiate TeleBirr payment with user verification
// @route     POST /api/payment/telebirr/initiate
// @access    Private
exports.initiateTelebirrPayment = async (req, res, next) => {
  try {
    const { amount, orderId, phoneNumber } = req.body;

    // Validate required fields
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and orderId are required'
      });
    }

    // Verify the order belongs to the user
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to user'
      });
    }

    // Verify the amount matches the order total
    if (Math.abs(order.totalPrice - amount) > 0.01) { // Allow small floating point differences
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match order total'
      });
    }

    // For demo purposes, we'll simulate the TeleBirr payment initiation
    // In a real implementation, this would communicate with TeleBirr API
    const paymentSessionId = `telebirr_session_${Date.now()}`;

    // Store payment session data temporarily (in a real app, use Redis or database)
    req.session = req.session || {};
    req.session.telebirrPayment = {
      sessionId: paymentSessionId,
      orderId: order._id,
      amount: order.totalPrice,
      userId: req.user.id,
      initiatedAt: Date.now(),
      phoneNumber: phoneNumber || req.user.phone || '+251912345678' // Default demo phone
    };

    res.status(200).json({
      success: true,
      message: 'TeleBirr payment initiated successfully',
      data: {
        sessionId: paymentSessionId,
        orderId: order._id,
        amount: order.totalPrice,
        phoneNumber: req.session.telebirrPayment.phoneNumber,
        status: 'initiated',
        // Simulate a 5-minute timeout for payment verification
        timeout: 300000 // 5 minutes in milliseconds
      }
    });
  } catch (error) {
    console.error('TeleBirr payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'TeleBirr payment initiation failed'
    });
  }
};

// @desc      Verify TeleBirr payment with PIN and balance check
// @route     POST /api/payment/telebirr/verify
// @access    Private
exports.verifyTelebirrPayment = async (req, res, next) => {
  try {
    const { sessionId, pin, amount } = req.body;

    // Validate required fields
    if (!sessionId || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and PIN are required'
      });
    }

    // Check if payment session exists
    if (!req.session || !req.session.telebirrPayment || req.session.telebirrPayment.sessionId !== sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired payment session'
      });
    }

    const paymentSession = req.session.telebirrPayment;

    // Verify PIN (in demo, we'll accept any 4-digit PIN)
    if (!pin.match(/^\d{4}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN format. Must be 4 digits.'
      });
    }

    // Verify the amount matches the session
    if (Math.abs(paymentSession.amount - amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch'
      });
    }

    // Simulate checking user balance (in demo, assume sufficient balance)
    // In a real implementation, this would check the user's TeleBirr balance
    const userBalance = 1000; // Demo balance
    if (userBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance in TeleBirr account'
      });
    }

    // Find the order
    const order = await Order.findOne({ _id: paymentSession.orderId, user: paymentSession.userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to user'
      });
    }

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `telebirr_${Date.now()}`,
      status: 'completed',
      updateTime: Date.now(),
      email_address: req.user.email,
      reference: `TB${Date.now()}`, // Demo reference number
      transactionId: `TB_TXN_${Date.now()}`,
      phoneNumber: paymentSession.phoneNumber
    };

    await order.save();

    // Clear the user's cart after successful payment
    const Cart = require('../models/Cart');
    const cart = await Cart.findOne({ user: paymentSession.userId });
    if (cart) {
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;
      await cart.save();
    }

    // Clear the payment session
    delete req.session.telebirrPayment;

    // Send payment confirmation email
    try {
      await sendOrderStatusUpdateEmail(req.user, order, 'paid');
    } catch (emailError) {
      console.error('Error sending payment confirmation email:', emailError);
      // Don't fail the order update if email fails
    }

    res.status(200).json({
      success: true,
      message: 'TeleBirr payment verified and processed successfully',
      data: {
        orderId: order._id,
        isPaid: true,
        receiptUrl: `/api/receipt/${order._id}/receipt`,
        downloadReceiptUrl: `/api/receipt/${order._id}/receipt?download=true`
      }
    });
  } catch (error) {
    console.error('TeleBirr payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'TeleBirr payment verification failed'
    });
  }
};

// @desc      Process TeleBirr payment
// @route     POST /api/payment/process
// @access    Private
exports.processPayment = async (req, res, next) => {
  try {
    const { amount, orderId, paymentMethod } = req.body;

    // Validate required fields
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and orderId are required'
      });
    }

    // Verify the order belongs to the user
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to user'
      });
    }

    // Handle TeleBirr payment method
    if (order.paymentMethod === 'telebirr') {
      // For demo TeleBirr payment, mark order as paid immediately
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: `telebirr_${Date.now()}`,
        status: 'completed',
        updateTime: Date.now(),
        email_address: req.user.email,
        reference: `TB${Date.now()}` // Demo reference number
      };

      await order.save();

      // Send payment confirmation email
      try {
        await sendOrderStatusUpdateEmail(req.user, order, 'paid');
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't fail the order update if email fails
      }

      res.status(200).json({
        success: true,
        message: 'TeleBirr payment processed successfully',
        data: {
          orderId: order._id,
          isPaid: true,
          receiptUrl: `/api/receipt/${order._id}/receipt`,
          downloadReceiptUrl: `/api/receipt/${order._id}/receipt?download=true`
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Only TeleBirr is supported.'
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment processing failed'
    });
  }
};

// @desc      TeleBirr webhook (for demo purposes)
// @route     POST /api/payment/webhook
// @access    Public
exports.sendStripeWebhook = async (req, res, next) => {
  // For demo TeleBirr, we just acknowledge the webhook
  res.status(200).json({ received: true });
};

// @desc      Confirm TeleBirr payment (for demo purposes)
// @route     POST /api/payment/confirm
// @access    Private
exports.confirmPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    // For demo TeleBirr, we just confirm the payment
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Mark order as paid if not already paid
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: `telebirr_${Date.now()}`,
        status: 'completed',
        updateTime: Date.now(),
        email_address: order.user.email,
        reference: `TB${Date.now()}` // Demo reference number
      };

      await order.save();

      try {
        await sendOrderConfirmationEmail(order.user, order);
      } catch (emailError) {
        console.error('Error sending order confirmation email after confirmPayment:', emailError);
      }
    }

    res.status(200).json({ success: true, message: 'TeleBirr payment confirmed and order updated', data: { orderId: order._id } });
  } catch (error) {
    console.error('Error in confirmPayment:', error);
    res.status(500).json({ success: false, message: 'Error confirming payment' });
  }
};

// @desc      Process TeleBirr payment (for direct payment)
// @route     POST /api/payment/internal
// @access    Private
exports.processInternalPayment = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    // Validate required fields
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'orderId and amount are required'
      });
    }

    // Verify the order belongs to the user
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to user'
      });
    }

    // Verify the amount matches the order total
    if (Math.abs(order.totalPrice - amount) > 0.01) { // Allow small floating point differences
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match order total'
      });
    }

    // Mark order as paid immediately for TeleBirr payment
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `telebirr_${Date.now()}`,
      status: 'completed',
      updateTime: Date.now(),
      email_address: req.user.email,
      reference: `TB${Date.now()}` // Demo reference number
    };

    await order.save();

    // Send payment confirmation email
    try {
      await sendOrderStatusUpdateEmail(req.user, order, 'paid');
    } catch (emailError) {
      console.error('Error sending payment confirmation email:', emailError);
      // Don't fail the order update if email fails
    }

    res.status(200).json({
      success: true,
      message: 'TeleBirr payment processed successfully',
      data: {
        orderId: order._id,
        isPaid: true,
        receiptUrl: `/api/receipt/${order._id}/receipt`,
        downloadReceiptUrl: `/api/receipt/${order._id}/receipt?download=true`
      }
    });
  } catch (error) {
    console.error('TeleBirr payment processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'TeleBirr payment processing failed'
    });
  }
};