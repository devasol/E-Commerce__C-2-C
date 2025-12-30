# Complete E-Commerce Payment System

## Overview
This document explains the complete e-commerce system with cart, checkout, and payment functionality.

## Complete Shopping Flow

### 1. Add Products to Cart
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

### 2. View Cart
```javascript
// Get cart contents
fetch('/api/cart', {
  headers: {
    'Authorization': `Bearer ${jwtToken}`
  }
})
```

### 3. Update Cart
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

### 4. Checkout Process

#### Option A: TeleBirr Payment
```javascript
// Checkout with TeleBirr
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
    paymentMethod: 'telebirr'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Order created successfully
    // Payment processed immediately
    // Email confirmation sent automatically
    // Cart cleared automatically
    console.log('Order created:', data.data.order._id);
    console.log('Receipt URL:', data.data.receiptUrl);
    console.log('Download Receipt URL:', data.data.downloadReceiptUrl);
    console.log('Success Message URL:', data.data.successMessageUrl);

    // Redirect to success page with auto-download receipt
    window.location.href = data.data.successMessageUrl;
  } else {
    console.log('Checkout failed:', data.message);
    // Redirect to error page
    window.location.href = data.errorMessageUrl || '/error';
  }
});
```

## Payment Methods Supported

### 1. TeleBirr Payment (Demo)
- Order is created immediately
- Order status is marked as paid immediately
- Email confirmation sent automatically
- Demo payment processing for Ethiopian mobile payments

## API Endpoints

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `PUT /api/cart/item/:productId` - Remove item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/checkout` - Create order from cart

### Order Management
- `POST /api/orders` - Create order directly
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get specific order

### Payment Processing
- `POST /api/payment/process` - Process TeleBirr payment
- `POST /api/payment/webhook` - Handle TeleBirr webhooks
- `POST /api/payment/confirm` - Confirm TeleBirr payment
- `POST /api/payment/internal` - Process TeleBirr payment directly

### Receipt Management
- `GET /api/receipt/:orderId/receipt` - View receipt in browser
- `GET /api/receipt/:orderId/receipt?download=true` - Download PDF receipt
- `GET /api/receipt-data/:orderId/data` - Get receipt data for inline display

## Email Notifications
- Order confirmation emails sent automatically
- Payment confirmation emails sent when payment succeeds
- Order status update emails when status changes

## Error Handling
- Proper validation for all inputs
- Stock validation to prevent overselling
- Authentication checks for all protected routes
- Meaningful error messages for all failure scenarios

## Frontend Integration Example

```javascript
// Complete checkout flow example
class CheckoutService {
  static async addToCart(productId, quantity) {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    return response.json();
  }

  static async checkout(shippingAddress, paymentMethod) {
    const response = await fetch('/api/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ shippingAddress, paymentMethod })
    });
    return response.json();
  }

  static async processPayment(orderId, amount, paymentMethod = 'telebirr') {
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ orderId, amount, paymentMethod })
    });
    return response.json();
  }
}

// Usage
async function completeCheckout() {
  try {
    // For TeleBirr
    const result = await CheckoutService.checkout(
      {
        fullName: 'John Doe',
        address: '123 Main St',
        city: 'Addis Ababa',
        state: 'AA',
        zipCode: '1000',
        country: 'Ethiopia',
        phone: '+251912345678'
      },
      'telebirr'
    );

    if (result.success) {
      alert('Order placed successfully! Check your email for confirmation.');
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  }
}
```

This complete system handles all aspects of e-commerce: cart management, checkout process, TeleBirr payment method, email notifications, and proper error handling.