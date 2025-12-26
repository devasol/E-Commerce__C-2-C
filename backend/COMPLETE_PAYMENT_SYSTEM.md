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

#### Option A: Cash on Delivery (COD)
```javascript
// Checkout with COD
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
    paymentMethod: 'cash on delivery'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Order created successfully
    // Email confirmation sent automatically
    // Cart cleared automatically
    console.log('Order created:', data.data.order._id);
  }
});
```

#### Option B: Stripe Card Payment
```javascript
// 1. Create order first with card payment method
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
    paymentMethod: 'card' // or 'stripe'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // 2. Process payment with Stripe
    const order = data.data.order;
    
    // Process payment
    fetch('/api/payment/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        amount: order.totalPrice,
        orderId: order._id
      })
    })
    .then(response => response.json())
    .then(paymentData => {
      if (paymentData.success) {
        // 3. Complete payment with Stripe.js
        const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
        
        stripe.confirmCardPayment(paymentData.client_secret, {
          payment_method: {
            card: cardElement, // Your card element
            billing_details: {
              name: 'John Doe'
            }
          }
        }).then(result => {
          if (result.error) {
            console.error('Payment failed:', result.error.message);
          } else if (result.paymentIntent.status === 'succeeded') {
            console.log('Payment successful!');
            // Order will be marked as paid via webhook
          }
        });
      }
    });
  }
});
```

## Payment Methods Supported

### 1. Cash on Delivery (COD)
- Order is created immediately
- Order status is marked as paid
- Email confirmation sent automatically
- No payment processing required

### 2. Stripe Card Payments
- Order is created with pending payment status
- Payment processed via Stripe
- Webhook updates order status when payment succeeds
- Email confirmation sent automatically

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
- `POST /api/payment/process` - Process Stripe payment
- `POST /api/payment/webhook` - Handle Stripe webhooks (configured on Stripe dashboard)

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

  static async processPayment(orderId, amount) {
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ orderId, amount })
    });
    return response.json();
  }
}

// Usage
async function completeCheckout() {
  try {
    // For COD
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
      'cash on delivery'
    );

    if (result.success) {
      alert('Order placed successfully! Check your email for confirmation.');
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  }
}
```

## Webhook Configuration
For Stripe webhooks to work properly, you need to configure them in your Stripe dashboard:
- Endpoint: `https://yourdomain.com/api/payment/webhook`
- Events: `payment_intent.succeeded`

For local development, you can use Stripe CLI:
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

This complete system handles all aspects of e-commerce: cart management, checkout process, multiple payment methods, email notifications, and proper error handling.