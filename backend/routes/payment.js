const express = require('express');
const { protect } = require('../middleware/auth');
const { processPayment, sendStripeWebhook, confirmPayment, processInternalPayment, initiateTelebirrPayment, verifyTelebirrPayment } = require('../controllers/paymentController');

const router = express.Router();

router.route('/process').post(protect, processPayment);
router.route('/confirm').post(protect, confirmPayment);
router.route('/internal').post(protect, processInternalPayment);
router.route('/telebirr/initiate').post(protect, initiateTelebirrPayment);
router.route('/telebirr/verify').post(protect, verifyTelebirrPayment);
router.route('/webhook').post(sendStripeWebhook); // This route doesn't need authentication

module.exports = router;