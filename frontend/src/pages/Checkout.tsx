import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../services/api';
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';

const Checkout: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderLoading, setOrderLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    document.title = 'Checkout - E-Shop';
    
    // Load saved shipping info if available
    const savedShipping = localStorage.getItem('shippingInfo');
    if (savedShipping) {
      setShippingInfo(JSON.parse(savedShipping));
    }
  }, []);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingInfo.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setOrderLoading(true);
    
    try {
      // Save shipping info to localStorage
      localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
      
      // Calculate totals
      const itemsPrice = cartState.totalPrice;
      const taxPrice = parseFloat((itemsPrice * 0.08).toFixed(2));
      const shippingPrice = 5.99;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;
      
      // Prepare order data
      const orderData = {
        orderItems: cartState.items.map((item: any) => ({
          product: typeof item.product === 'object' ? item.product._id : item.product,
          name: typeof item.product === 'object' ? item.product.name : 'Product',
          quantity: item.quantity,
          price: item.price,
          image: typeof item.product === 'object' && item.product.images ? item.product.images[0] : ''
        })),
        shippingAddress: shippingInfo,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };
      
      // Create order
      const orderResponse = await orderAPI.create(orderData);
      const order = orderResponse.data.data;
      
      // If payment method is not cash on delivery, process payment
      if (paymentMethod !== 'cash on delivery') {
        // Process payment through Stripe
        const paymentResponse = await paymentAPI.processPayment(totalPrice, order._id);
        const clientSecret = paymentResponse.data.client_secret;
        
        // In a real app, you would use Stripe.js to confirm the payment
        // For now, we'll assume payment is successful
        console.log('Payment client secret:', clientSecret);
      }
      
      // Clear cart after successful order
      await clearCart();
      
      // Redirect to order confirmation
      navigate(`/order/${order._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderLoading(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Please add items to your cart before checking out</p>
        <button 
          onClick={() => navigate('/products')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="123 Main St"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="NY"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    className={`w-full p-3 border rounded-lg ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10001"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className={`w-full p-3 border rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="USA"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cartState.items.map((item: any, index: number) => (
                <motion.div 
                  key={typeof item.product === 'object' ? item.product._id : item.product}
                  className="flex items-center pb-4 border-b border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                    <img 
                      src={typeof item.product === 'object' ? 
                        (item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/100x100') 
                        : 'https://via.placeholder.com/100x100'} 
                      alt={typeof item.product === 'object' ? item.product.name : 'Product'} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold">
                      {typeof item.product === 'object' ? item.product.name : 'Product Name'}
                    </h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartState.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$5.99</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(cartState.totalPrice * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(cartState.totalPrice + 5.99 + (cartState.totalPrice * 0.08)).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <FaCreditCard className="text-blue-600 mr-3 text-xl" />
                <span>Credit/Debit Card</span>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile banking"
                  checked={paymentMethod === 'mobile banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <FaMobileAlt className="text-green-600 mr-3 text-xl" />
                <span>Mobile Banking</span>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash on delivery"
                  checked={paymentMethod === 'cash on delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <FaMoneyBillWave className="text-yellow-600 mr-3 text-xl" />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
          
          {/* Place Order Button */}
          <button
            onClick={handleSubmit}
            disabled={orderLoading}
            className={`w-full py-4 rounded-lg font-bold text-white ${
              orderLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {orderLoading ? 'Processing Order...' : `Place Order - $${(cartState.totalPrice + 5.99 + (cartState.totalPrice * 0.08)).toFixed(2)}`}
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            className="w-full mt-3 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;