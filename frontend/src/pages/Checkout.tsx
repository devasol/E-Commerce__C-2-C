import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api, { orderAPI, paymentAPI } from '../services/api';
import axios from 'axios';
import { FaMobileAlt, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

import { useSearchParams } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingOrderId = searchParams.get('orderId');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [loadingExistingOrder, setLoadingExistingOrder] = useState(!!existingOrderId);
  const [orderLoading, setOrderLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  // Telebirr payment states
  const [telebirrStep, setTelebirrStep] = useState<'form' | 'initiated' | 'verifying' | 'verified'>('form');
  const [telebirrSession, setTelebirrSession] = useState<any>(null);
  const [telebirrPin, setTelebirrPin] = useState('');
  const [telebirrPhoneNumber, setTelebirrPhoneNumber] = useState('');
  const [telebirrBalance, setTelebirrBalance] = useState<number>(1000); // Demo balance
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes in seconds

  useEffect(() => {
    document.title = 'Checkout - E-Shop';

    // Load saved shipping info if available
    const savedShipping = localStorage.getItem('shippingInfo');
    if (savedShipping) {
      setShippingInfo(JSON.parse(savedShipping));
    }

    // If there's an existing order ID, fetch the order details
    if (existingOrderId) {
      const fetchExistingOrder = async () => {
        try {
          const response = await orderAPI.getById(existingOrderId);
          const order = response.data.data;
          setExistingOrder(order);

          // Set shipping info from the existing order
          setShippingInfo(order.shippingAddress);

          // Set payment method to telebirr for completing payment
          setPaymentMethod('telebirr');

          setLoadingExistingOrder(false);
        } catch (error) {
          console.error('Error fetching existing order:', error);
          setErrorMessage('Could not load order details. Please try again.');
          setLoadingExistingOrder(false);
        }
      };

      fetchExistingOrder();
    }
  }, [existingOrderId]);

  // Countdown timer for Telebirr payment
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (telebirrStep === 'initiated' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Timeout reached, reset the payment process
            setTelebirrStep('form');
            setTelebirrSession(null);
            setErrorMessage('Payment session expired. Please try again.');
            return 300; // Reset to 5 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [telebirrStep, countdown]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingInfo.country.trim()) newErrors.country = 'Country is required';

    // For TeleBirr, phone number is required
    if (paymentMethod === 'telebirr' && !shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required for TeleBirr payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setOrderLoading(true);

    try {
      // If there's an existing order, we're just processing payment for it
      if (existingOrderId && existingOrder) {
        // For TeleBirr payments, initiate the realistic payment flow
        if (paymentMethod === 'telebirr') {
          try {
            // Initiate TeleBirr payment
            const paymentResponse = await paymentAPI.initiateTelebirrPayment(
              existingOrder.totalPrice,
              existingOrder._id,
              telebirrPhoneNumber || shippingInfo.phone
            );

            if (paymentResponse.data.success) {
              setTelebirrSession(paymentResponse.data.data);
              setTelebirrStep('initiated');
              setOrderLoading(false);
              setErrorMessage(null);
            } else {
              setErrorMessage(paymentResponse.data.message || 'Failed to initiate TeleBirr payment. Please try again.');
              setOrderLoading(false);
            }
          } catch (payErr: any) {
            setErrorMessage(payErr?.response?.data?.message || payErr?.message || 'Error initiating TeleBirr payment');
            setOrderLoading(false);
          }
        } else {
          setErrorMessage('Invalid payment method selected for existing order.');
          setOrderLoading(false);
        }
      } else {
        // For TeleBirr payments, we need to create the order first and then initiate payment
        if (paymentMethod === 'telebirr') {
          // Save shipping info to localStorage
          localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));

          // Calculate totals
          const itemsPrice = cartState.totalPrice;
          const taxPrice = parseFloat((itemsPrice * 0.08).toFixed(2));
          const shippingPrice = 5.99;
          const totalPrice = itemsPrice + taxPrice + shippingPrice;

          // Prepare order data
          const orderData = {
            orderItems: cartState.items.map((item: any) => {
              // Ensure we have the product object with name property
              let productName = 'Product';
              let productImage = '';
              let productId = '';

              if (typeof item.product === 'object') {
                // Product is a full object
                productName = item.product.name || 'Product';
                productImage = item.product.images && item.product.images.length > 0 ? item.product.images[0] : '';
                productId = item.product._id;
              } else {
                // Product is just an ID string, need to find the product in cart items
                // This should not happen if cart is properly populated, but adding fallback
                productId = item.product;
              }

              return {
                product: productId,
                name: productName,
                quantity: item.quantity,
                price: item.price,
                image: productImage
              };
            }),
            shippingAddress: shippingInfo,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
          };

          // Create order first
          const orderResponse = await orderAPI.create(orderData);
          const responseData = orderResponse.data.data;
          const order = responseData.order || responseData;

          // Now initiate TeleBirr payment
          try {
            const paymentResponse = await paymentAPI.initiateTelebirrPayment(
              order.totalPrice,
              order._id,
              telebirrPhoneNumber || shippingInfo.phone
            );

            if (paymentResponse.data.success) {
              setTelebirrSession(paymentResponse.data.data);
              setTelebirrStep('initiated');
              setOrderLoading(false);
              setErrorMessage(null);
            } else {
              setErrorMessage(paymentResponse.data.message || 'Failed to initiate TeleBirr payment. Please try again.');
              setOrderLoading(false);
            }
          } catch (payErr: any) {
            setErrorMessage(payErr?.response?.data?.message || payErr?.message || 'Error initiating TeleBirr payment');
            setOrderLoading(false);
          }
        } else {
          setErrorMessage('Only TeleBirr payment method is currently supported in this demo.');
          setOrderLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Error processing order:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to process order. Please try again.';
      setErrorMessage(msg);
      setSuccessMessage(null);
      setOrderLoading(false);
    }
  };

  // Handle Telebirr PIN verification
  const handleTelebirrVerification = async () => {
    if (!telebirrPin || telebirrPin.length !== 4) {
      setErrorMessage('Please enter a valid 4-digit PIN');
      return;
    }

    if (!telebirrSession) {
      setErrorMessage('No active payment session');
      return;
    }

    // Check if user has sufficient balance
    const orderTotal = existingOrder ? existingOrder.totalPrice :
      (cartState.totalPrice + 5.99 + (cartState.totalPrice * 0.08));

    if (telebirrBalance < orderTotal) {
      setErrorMessage(`Insufficient balance. Your TeleBirr balance is $${telebirrBalance.toFixed(2)}, but the order total is $${orderTotal.toFixed(2)}.`);
      return;
    }

    setOrderLoading(true);
    setTelebirrStep('verifying');

    try {
      const verifyResponse = await paymentAPI.verifyTelebirrPayment(
        telebirrSession.sessionId,
        telebirrPin,
        telebirrSession.amount
      );

      if (verifyResponse.data.success) {
        setTelebirrStep('verified');

        // Download receipt
        let fullDownloadUrl: string | null = null;
        if (verifyResponse.data.data.downloadReceiptUrl) {
          try {
            setDownloadingReceipt(true);
            const downloadFilename = `receipt-${verifyResponse.data.data.orderId}.pdf`;
            const rawApi = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const apiBase = rawApi.replace(/\/api$/, '');
            fullDownloadUrl = `${apiBase}${verifyResponse.data.data.downloadReceiptUrl}`;
            const res = await axios.get(fullDownloadUrl, { responseType: 'blob' });
            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (dlErr) {
            console.error('Error downloading receipt:', dlErr);
          } finally {
            setDownloadingReceipt(false);
          }
        }

        // Clear the cart after successful payment regardless of whether it was an existing order or new order
        await clearCart();

        // Show success state
        setOrderSuccess({
          orderId: verifyResponse.data.data.orderId,
          message: 'Your TeleBirr payment has been processed successfully! Thank you for your purchase.',
          downloadUrl: fullDownloadUrl
        });
        setOrderLoading(false);
        setErrorMessage(null);
        setTelebirrPin('');
      } else {
        setErrorMessage(verifyResponse.data.message || 'TeleBirr payment verification failed. Please try again.');
        setTelebirrStep('initiated'); // Go back to PIN entry
        setOrderLoading(false);
      }
    } catch (error: any) {
      console.error('Error verifying TeleBirr payment:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to verify TeleBirr payment. Please try again.';
      setErrorMessage(msg);
      setTelebirrStep('initiated'); // Go back to PIN entry
      setOrderLoading(false);
    }
  };

  // Format time for countdown display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!existingOrderId && cartState.items.length === 0 && !orderSuccess) {
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

  if (loadingExistingOrder) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading order details...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  function renderCheckoutContent() {
    return (
      <>
        {successMessage && (
          <div className="mb-4 p-4 rounded bg-green-50 border border-green-200 text-green-800">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 rounded bg-red-50 border border-red-200 text-red-800">
            {errorMessage}
          </div>
        )}
        {/* If orderSuccess is set, show centered success panel and hide the form */}
        {orderSuccess ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-700">{orderSuccess.message}</h2>
            <p className="text-gray-700 mb-4">Order ID: <strong>{orderSuccess.orderId}</strong></p>
            {downloadingReceipt && <p className="text-gray-600 mb-4">Downloading receipt...</p>}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(`/order/${orderSuccess.orderId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Order
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        )}

        {/* Only show the checkout form if orderSuccess is not set */}
        {!orderSuccess && (
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
                        placeholder="Ethiopia"
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Phone (For TeleBirr)</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+251912345678"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">TeleBirr Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={telebirrPhoneNumber}
                      onChange={(e) => setTelebirrPhoneNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="+251912345678"
                    />
                    <p className="text-sm text-gray-600 mt-1">Enter your TeleBirr registered phone number if different from above</p>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {existingOrder ? (
                  // Show existing order items
                  <div>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {existingOrder.orderItems.map((item: any, index: number) => (
                        <motion.div
                          key={item.product._id || index}
                          className="flex items-center pb-4 border-b border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                            <img
                              src={item.image || 'https://via.placeholder.com/100x100'}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-grow">
                            <h3 className="font-semibold">{item.name}</h3>
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
                        <span>${existingOrder.itemsPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${existingOrder.shippingPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${existingOrder.taxPrice.toFixed(2)}</span>
                      </div>

                      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${existingOrder.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show cart items
                  <div>
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
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="telebirr"
                      checked={paymentMethod === 'telebirr'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <FaMobileAlt className="text-green-600 mr-3 text-xl" />
                    <div className="flex-grow">
                      <span>TeleBirr Payment</span>
                      <p className="text-sm text-gray-600 mt-1">Pay securely with TeleBirr mobile payment service</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* TeleBirr PIN / Verification UI (shown after initiating payment) */}
              {telebirrStep === 'initiated' && !orderSuccess && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Complete TeleBirr Payment</h3>
                  <p className="text-sm text-gray-600 mb-3">Enter your 4-digit TeleBirr PIN to confirm the payment.</p>

                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="text"
                      maxLength={4}
                      value={telebirrPin}
                      onChange={(e) => setTelebirrPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-32 p-3 border rounded-lg text-center"
                      placeholder="PIN"
                    />

                    <button
                      onClick={handleTelebirrVerification}
                      disabled={orderLoading}
                      className={`px-4 py-2 rounded-lg text-white ${orderLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {orderLoading ? 'Verifying...' : 'Verify PIN'}
                    </button>

                    <button
                      onClick={() => { setTelebirrStep('form'); setTelebirrSession(null); setErrorMessage(null); }}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span>Time left: </span>
                    <strong>{formatTime(countdown)}</strong>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              {!orderSuccess && (
                <button
                  onClick={handleSubmit}
                  disabled={orderLoading}
                  className={`w-full py-4 rounded-lg font-bold text-white ${
                    orderLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {orderLoading ? 'Processing...' :
                    existingOrder ?
                      `Complete Payment - $${existingOrder.totalPrice.toFixed(2)}` :
                      `Place Order - $${(cartState.totalPrice + 5.99 + (cartState.totalPrice * 0.08)).toFixed(2)}`
                  }
                </button>
              )}

              {!orderSuccess && (
                <button
                  onClick={() => {
                    if (existingOrder) {
                      navigate('/order-history'); // Go back to order history if processing existing order
                    } else {
                      navigate('/cart'); // Go back to cart if creating new order
                    }
                  }}
                  className="w-full mt-3 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {existingOrder ? 'Back to Order History' : 'Back to Cart'}
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        {renderCheckoutContent()}
      </div>
    );
};

export default Checkout;