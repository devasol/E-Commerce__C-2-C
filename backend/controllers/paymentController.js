const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc      Process payment
// @route     POST /api/payment/process
// @access    Private
exports.processPayment = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    // Verify the order belongs to the user
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Get payment success/failure
// @route     POST /api/payment/webhook
// @access    Public
exports.sendStripeWebhook = async (req, res, next) => {
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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Update order status to paid
    const orderId = paymentIntent.metadata.orderId;

    const order = await Order.findById(orderId);
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
    }
  }

  res.status(200).json({ received: true });
};