const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Check if nodemailer is properly loaded
    if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
      throw new Error('Nodemailer is not properly configured');
    }

    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });

    // Verify transporter configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn('Email configuration is missing. Please set SMTP_HOST, SMTP_EMAIL, and SMTP_PASSWORD in your environment variables.');
      return; // Skip email sending if configuration is missing
    }

    // Define email options
    const mailOptions = {
      from: process.env.SMTP_FROM_NAME ?
        `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>` :
        process.env.SMTP_FROM_EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html || options.message, // Support both html and message fields
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error in sendEmail function:', error);
    throw error;
  }
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  try {
    const orderTotal = order.totalPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    const orderItemsList = order.orderItems.map(item =>
      `- ${item.name} (x${item.quantity}) - ${item.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })} each`
    ).join('<br>');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${user.name || user.firstName || 'Customer'},</p>

        <p>Thank you for your order! Here are the details:</p>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Status:</strong> ${order.isPaid ? 'Paid' : 'Pending'}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3>Items Ordered</h3>
          <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
            ${orderItemsList}
          </div>
        </div>

        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3>Order Summary</h3>
          <p><strong>Items Price:</strong> ${order.itemsPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}</p>
          <p><strong>Tax:</strong> ${order.taxPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}</p>
          <p><strong>Shipping:</strong> ${order.shippingPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}</p>
          <p style="font-size: 18px; font-weight: bold;"><strong>Total:</strong> ${orderTotal}</p>
        </div>

        <div style="margin: 15px 0;">
          <h3>Shipping Address</h3>
          <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}
            ${order.shippingAddress.phone ? `<br>Phone: ${order.shippingAddress.phone}` : ''}
          </p>
        </div>

        <p>If you have any questions about your order, please contact us at ${process.env.SMTP_EMAIL}.</p>

        <p>Thank you for shopping with us!</p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated email, please do not reply directly to this message.
        </p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: `Order Confirmation - ${order._id}`,
      html: html,
      text: `Order Confirmation - Order ID: ${order._id}\n\nDear ${user.name || user.firstName || 'Customer'},\n\nThank you for your order!\n\nOrder Total: ${orderTotal}\nPayment Method: ${order.paymentMethod}\n\nThank you for shopping with us!`
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Function to send order status update email
const sendOrderStatusUpdateEmail = async (user, order, status) => {
  try {
    const statusMessages = {
      'pending': 'Your order is being processed.',
      'processing': 'Your order is being prepared for shipping.',
      'shipped': 'Your order has been shipped and is on the way to you.',
      'delivered': 'Your order has been delivered successfully.',
      'cancelled': 'Your order has been cancelled.'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Dear ${user.name || user.firstName || 'Customer'},</p>

        <p>Your order <strong>${order._id}</strong> status has been updated to <strong>${status}</strong>.</p>

        <div style="margin: 15px 0;">
          ${statusMessages[status] || `Your order status is now ${status}.`}
        </div>

        <div style="margin: 15px 0;">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Updated At:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Current Status:</strong> ${status}</p>
        </div>

        <p>You can view your order details by logging into your account.</p>

        <p>If you have any questions, please contact us at ${process.env.SMTP_EMAIL}.</p>

        <p>Thank you for shopping with us!</p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This is an automated email, please do not reply directly to this message.
        </p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: `Order Status Update - ${order._id}`,
      html: html,
      text: `Order Status Update - Order ID: ${order._id}\n\nDear ${user.name || user.firstName || 'Customer'},\n\nYour order status has been updated to ${status}.\n\nThank you for shopping with us!`
    });
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail
};