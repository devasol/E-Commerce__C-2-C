const express = require('express');
const puppeteer = require('puppeteer');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc      Get order receipt
// @route     GET /api/receipt/:orderId/receipt
// @access    Private
router.route('/:orderId/receipt').get(protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.orderId}`
      });
    }

    // Make sure user is the order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    // Generate HTML for the receipt
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt - ${order._id}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .order-id {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
          }
          .order-date {
            font-size: 16px;
            color: #666;
            margin-top: 5px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            margin-bottom: 15px;
            color: #333;
          }
          .order-items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .order-items th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
          .order-items td {
            padding: 12px;
            border: 1px solid #ddd;
          }
          .order-items tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .summary-total {
            font-weight: bold;
            font-size: 18px;
            padding-top: 15px;
            border-top: 2px solid #333;
            margin-top: 10px;
          }
          .shipping-address {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #007bff;
          }
          .payment-info {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #28a745;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ORDER RECEIPT</h1>
          <div class="order-id">Order ID: ${order._id}</div>
          <div class="order-date">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table class="order-items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Order Summary</div>
          <div class="summary-row">
            <span>Items Price:</span>
            <span>$${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Tax:</span>
            <span>$${order.taxPrice.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>$${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div class="summary-row summary-total">
            <span>Total:</span>
            <span>$${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Shipping Address</div>
          <div class="shipping-address">
            <p><strong>${order.shippingAddress.fullName}</strong></p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p>${order.shippingAddress.country}</p>
            ${order.shippingAddress.phone ? `<p>Phone: ${order.shippingAddress.phone}</p>` : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Information</div>
          <div class="payment-info">
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Status:</strong> ${order.isPaid ? 'PAID' : 'PENDING'}</p>
            ${order.isPaid ? `<p><strong>Paid At:</strong> ${new Date(order.paidAt).toLocaleString()}</p>` : ''}
            ${order.paymentResult ? `<p><strong>Transaction ID:</strong> ${order.paymentResult.id}</p>` : ''}
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p>If you have any questions about your order, please contact us.</p>
          <p>This is an automated receipt, please do not reply directly to this message.</p>
        </div>
      </body>
      </html>
    `;

    // Check if user wants to download PDF or view HTML
    const download = req.query.download === 'true';

    if (download) {
      // Generate PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(receiptHtml, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();

      res.contentType('application/pdf');
      res.header('Content-Disposition', `attachment; filename="order-receipt-${order._id}.pdf"`);
      res.send(pdf);
    } else {
      // Send HTML receipt
      // Add CORS headers for inline display
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.send(receiptHtml);
    }
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating receipt'
    });
  }
});

module.exports = router;