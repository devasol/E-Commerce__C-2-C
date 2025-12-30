const User = require('../models/User');
const Order = require('../models/Order');
const { sendOrderStatusUpdateEmail } = require('../utils/sendEmail');

// @desc      Get user account balance
// @route     GET /api/account/balance
// @access    Private
exports.getAccountBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('accountBalance');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: user.accountBalance
      }
    });
  } catch (error) {
    console.error('Get account balance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc      Add funds to user account
// @route     POST /api/account/add-funds
// @access    Private
exports.addFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add funds to account balance
    user.accountBalance = (user.accountBalance || 0) + parseFloat(amount);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Funds added successfully',
      data: {
        balance: user.accountBalance
      }
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc      Withdraw funds from user account
// @route     POST /api/account/withdraw-funds
// @access    Private
exports.withdrawFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has sufficient balance
    if ((user.accountBalance || 0) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds in account'
      });
    }

    // Deduct funds from account balance
    user.accountBalance = (user.accountBalance || 0) - parseFloat(amount);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Funds withdrawn successfully',
      data: {
        balance: user.accountBalance
      }
    });
  } catch (error) {
    console.error('Withdraw funds error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc      Process payment using account balance
// @route     POST /api/account/payment
// @access    Private
exports.processAccountPayment = async (req, res, next) => {
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

    const user = await User.findById(req.user.id);

    // Check if user has sufficient balance
    if ((user.accountBalance || 0) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds in account for this payment'
      });
    }

    // Deduct funds from account balance
    user.accountBalance = (user.accountBalance || 0) - parseFloat(amount);
    await user.save();

    // Mark order as paid immediately for account balance payment
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `account_payment_${Date.now()}`,
      status: 'completed',
      updateTime: Date.now(),
      email_address: user.email
    };

    await order.save();

    // Send payment confirmation email
    try {
      await sendOrderStatusUpdateEmail(user, order, 'paid');
    } catch (emailError) {
      console.error('Error sending payment confirmation email:', emailError);
      // Don't fail the order update if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Account balance payment processed successfully',
      data: {
        orderId: order._id,
        isPaid: true,
        receiptUrl: `/api/receipt/${order._id}/receipt`,
        downloadReceiptUrl: `/api/receipt/${order._id}/receipt?download=true`,
        remainingBalance: user.accountBalance
      }
    });
  } catch (error) {
    console.error('Account payment processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Account payment processing failed'
    });
  }
};