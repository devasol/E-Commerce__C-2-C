const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  getAccountBalance, 
  addFunds, 
  withdrawFunds,
  processAccountPayment 
} = require('../controllers/accountController');

const router = express.Router();

router.route('/balance').get(protect, getAccountBalance);
router.route('/add-funds').post(protect, addFunds);
router.route('/withdraw-funds').post(protect, withdrawFunds);
router.route('/payment').post(protect, processAccountPayment);

module.exports = router;