const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for payment sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'telebirr_payment_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/account', require('./routes/account'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/receipt', require('./routes/receipt'));
app.use('/api/receipt-data', require('./routes/receiptData'));
app.use('/api/checkout', require('./routes/checkout'));

// Payment webhook route with raw body parsing (must be defined after payment routes to avoid conflicts)
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const { sendStripeWebhook } = require('./controllers/paymentController');
  sendStripeWebhook(req, res);
});

// Specific route to handle order confirmation - redirect to success message with receipt
app.get('/order/:orderId', (req, res) => {
  // Redirect to the message API to show success message and auto-download receipt
  res.redirect(`/api/messages?type=success&message=Your+order+was+placed+successfully&orderId=${req.params.orderId}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});