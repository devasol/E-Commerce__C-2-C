// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set in environment variables');
  } else if (process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key' || process.env.STRIPE_SECRET_KEY === 'sk_test_...') {
    console.error('Please set a valid STRIPE_SECRET_KEY in your environment variables');
  }

  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.error('Error initializing Stripe:', error.message);
  stripe = null;
}
const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderStatusUpdateEmail, sendOrderConfirmationEmail } = require('../utils/sendEmail');

// @desc      Process payment
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

    // Handle different payment methods
    if (order.paymentMethod === 'cash on delivery' || order.paymentMethod === 'mobile banking') {
      // For COD and mobile banking, mark order as paid immediately
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: `payment_${Date.now()}`,
        status: 'completed',
        updateTime: Date.now(),
        email_address: req.user.email
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
        message: 'Payment processed successfully',
        data: {
          orderId: order._id,
          isPaid: true,
          receiptUrl: `/api/receipt/${order._id}/receipt`,
          downloadReceiptUrl: `/api/receipt/${order._id}/receipt?download=true`
        }
      });
    } else if (order.paymentMethod === 'card') {
      // Check if Stripe is properly initialized
      if (!stripe) {
        return res.status(500).json({
          success: false,
          message: 'Payment gateway not configured properly. Please contact administrator.'
        });
      }

      // Validate Stripe configuration
      if (!process.env.STRIPE_SECRET_KEY ||
          process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key' ||
          process.env.STRIPE_SECRET_KEY === 'sk_test_...') {
        return res.status(500).json({
          success: false,
          message: 'Payment gateway not configured properly. Please contact administrator.'
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: {
          userId: req.user.id,
          orderId: orderId
        }
      });

      res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
        receiptUrl: `/api/receipt/${orderId}/receipt`,
        downloadReceiptUrl: `/api/receipt/${orderId}/receipt?download=true`
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
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

// @desc      Get payment success/failure
// @route     POST /api/payment/webhook
// @access    Public
exports.sendStripeWebhook = async (req, res, next) => {
  // Check if Stripe is properly initialized
  if (!stripe) {
    console.error('Stripe not initialized for webhook');
    return res.status(500).send('Server configuration error');
  }

  const signature = req.headers['stripe-signature'];
  const body = req.body;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Update order status to paid
    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        updateTime: paymentIntent.created,
        email_address: paymentIntent.receipt_email
      };

      await order.save();

      // Send payment confirmation email
      try {
        await sendOrderStatusUpdateEmail(order.user, order, 'paid');
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't fail the order update if email fails
      }
    }
  }

  res.status(200).json({ received: true });
};