# Complete Cart and Checkout System

## Overview
This document explains the complete cart and checkout flow with payment integration for your e-commerce application.

## API Endpoints

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `PUT /api/cart/item/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `POST /api/cart/checkout` - Create order from cart

### Order Management
- `POST /api/orders` - Create order (alternative to checkout)
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders/myorders` - Get user's orders

### Payment
- `POST /api/payment/process` - Process payment with Stripe
- `POST /api/payment/webhook` - Handle Stripe webhooks

## Complete Flow

### 1. Adding Products to Cart
```javascript
// Add product to cart
fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    productId: 'PRODUCT_ID',
    quantity: 2
  })
})
```

### 2. Viewing Cart
```javascript
// Get cart contents
fetch('/api/cart', {
  headers: {
    'Authorization': `Bearer ${jwtToken}`
  }
})
```

### 3. Updating Cart
```javascript
// Update item quantity
fetch('/api/cart', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    productId: 'PRODUCT_ID',
    quantity: 3
  })
})
```

### 4. Proceeding to Checkout
```javascript
// Checkout from cart
fetch('/api/cart/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'Addis Ababa',
      state: 'AA',
      zipCode: '1000',
      country: 'Ethiopia',
      phone: '+251912345678'
    },
    paymentMethod: 'cash on delivery' // or 'card' for Stripe
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Order created successfully
    console.log('Order ID:', data.data.order._id);
    console.log('Receipt URL:', data.data.receiptUrl);
    console.log('Download Receipt URL:', data.data.downloadReceiptUrl);
    console.log('Success Message URL:', data.data.successMessageUrl);

    // Option 1: Redirect to success page with auto-download
    window.location.href = data.data.successMessageUrl;

    // Option 2: Trigger manual download
    // window.open(data.data.downloadReceiptUrl, '_blank');
  } else {
    console.log('Checkout failed:', data.message);
    // Handle error - could redirect to error page
    window.location.href = data.errorMessageUrl || '/error';
  }
});
```

### 5. Processing Payment (for card payments)
```javascript
// If using card payment, process with Stripe
const response = await fetch('/api/payment/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  },
  body: JSON.stringify({
    amount: order.totalPrice,
    orderId: order._id
  })
});

const { client_secret } = response.data;

// Use Stripe.js to complete payment
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
const result = await stripe.confirmCardPayment(client_secret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'Jenny Rosen'
    }
  }
});
```

## Frontend Implementation

### Complete Checkout Process
1. User adds products to cart
2. User views cart and proceeds to checkout
3. User enters shipping information and selects payment method
4. If payment method is "cash on delivery", order is created immediately
5. If payment method is "card", Stripe payment is processed
6. Order confirmation email is sent automatically
7. Cart is cleared after successful order

### Error Handling
- Stock validation prevents overselling
- Authentication required for all cart operations
- Proper error messages for all failure scenarios
- Email notifications for successful orders

## Email Notifications
- Order confirmation emails are sent automatically
- Payment confirmation emails for successful payments
- Order status update emails when status changes

## Security Features
- All endpoints protected with JWT authentication
- Stock validation to prevent overselling
- Proper input validation
- Secure payment processing with Stripe

## Testing the Flow
1. Add products to cart
2. Verify cart contents
3. Proceed to checkout with shipping info
4. Select payment method (COD or Card)
5. For card payments, complete Stripe payment
6. Verify order creation and email confirmation
7. Verify cart is cleared after checkout

This complete system handles the entire flow from adding products to cart through payment and order confirmation with email notifications.