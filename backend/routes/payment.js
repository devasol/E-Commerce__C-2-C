const express = require('express');
const { protect } = require('../middleware/auth');
const { processPayment, sendStripeWebhook } = require('../controllers/paymentController');

const router = express.Router();

router.route('/process').post(protect, processPayment);
router.route('/webhook').post(sendStripeWebhook); // This route doesn't need authentication

module.exports = router;