const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, updateRole, forgotPasswordOTP, verifyOTP, resetPasswordWithOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updaterole', protect, updateRole);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/forgotpasswordotp', forgotPasswordOTP);
router.post('/verifyotp', verifyOTP);
router.put('/resetpasswordwithotp', resetPasswordWithOTP);

module.exports = router;