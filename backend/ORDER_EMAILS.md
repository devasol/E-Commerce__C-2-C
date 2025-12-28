# Order Confirmation and Email System

## Features Implemented

1. **Order Confirmation Emails**: Automatically sent when orders are created
2. **Order Status Update Emails**: Sent when order status changes (pending, processing, shipped, delivered, cancelled)
3. **Payment Confirmation Emails**: Sent when payments are successfully processed
4. **Message API**: Simple API endpoint to display success/error messages

## Email Configuration

Make sure your .env file has the following SMTP settings:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=Your Store Name
```

For Gmail, you'll need to use an App Password instead of your regular password.

## API Endpoints

### Order Confirmation Email
- When an order is created via `POST /api/orders`, an email is automatically sent to the customer

### Payment Confirmation Email
- When a payment is successful, the Stripe webhook sends an email confirmation

### Order Status Update Email
- When an admin updates an order status via `PUT /api/orders/:id`, an email is sent to the customer

### Message API
- `GET /api/messages?type=success&message=Your+order+was+placed+successfully&orderId=12345`
- This can be used to display success/error messages on the frontend

## Frontend Integration

### Success and Error Messages
The system now provides enhanced success and error message pages that automatically handle receipt downloads:

```
// After successful order creation - redirect to success page with auto-download
window.location.href = `/api/messages?type=success&message=Your+order+was+placed+successfully&orderId=${order._id}`;

// After failed order - redirect to error page
window.location.href = `/api/messages?type=error&message=${encodeURIComponent(errorMessage)}`;
```

### Using Checkout API Response
The checkout API now returns URLs for success/error handling:

```
// After calling POST /api/cart/checkout
fetch('/api/cart/checkout', { ... })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Redirect to success page with auto-download receipt
      window.location.href = data.data.successMessageUrl;
    } else {
      // Redirect to error page
      window.location.href = data.errorMessageUrl || '/error';
    }
  });
```

### Manual Receipt Download
You can also trigger receipt download manually:

```
// Download receipt PDF
window.open(`/api/receipt/${orderId}/receipt?download=true`, '_blank');

// View receipt in browser
window.open(`/api/receipt/${orderId}/receipt`, '_blank');
```

## Error Handling

- All email functions have try-catch blocks to prevent failures from breaking the main functionality
- Email errors are logged to the console but don't affect order processing
- If email sending fails, the order is still processed successfully