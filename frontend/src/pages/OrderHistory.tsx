import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI, accountAPI } from '../services/api';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const OrderHistory: React.FC = () => {
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getMyOrders();
        setOrders(response.data.data);
        setLoading(false);
        document.title = 'Order History - E-Shop';
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsReceived = async (orderId: string) => {
    try {
      await orderAPI.markAsReceived(orderId);
      // Update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, isReceived: true, status: 'received', receivedAt: new Date().toISOString() }
            : order
        )
      );
      toast.success('Order marked as received successfully!');
    } catch (error: any) {
      console.error('Error marking order as received:', error);
      toast.error(error.response?.data?.message || 'Failed to mark order as received');
    }
  };

  const processInternalPayment = async (orderId: string, amount: number) => {
    try {
      // Check if the payment method is internal (account balance) and use appropriate API
      const response = await accountAPI.processAccountPayment(orderId, amount);
      if (response.data.success) {
        // Update the order in the local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, isPaid: true, paidAt: new Date().toISOString() }
              : order
          )
        );
        toast.success('Payment processed successfully!');
      } else {
        toast.error(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Error processing internal payment:', error);
      toast.error(error.response?.data?.message || 'Error processing payment');
    }
  };

  const processCardPayment = async (orderId: string, amount: number) => {
    // Check if Stripe key is available before proceeding
    const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey || stripeKey.trim() === '') {
      toast.error('Payment gateway is not configured. Please contact support or try another payment method.');
      return;
    }

    if (window.confirm('This will redirect you to complete your card payment. Do you want to continue?')) {
      // Redirect to checkout page to complete payment
      // We'll pass the order ID as a query parameter so the checkout page can handle the existing order
      window.location.href = `/checkout?orderId=${orderId}`;
    }
  };

  // Check if the current user is a seller of any product in this order
  const isSellerOfOrder = (order: any) => {
    if (!order || !order.orderItems) return false;

    // Check if any of the products in the order belong to the current user
    return order.orderItems.some((item: any) =>
      item.product && item.product.seller &&
      item.product.seller._id === authState.user?._id
    );
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await api.put(`/orders/${orderId}/seller-update`, { status: newStatus });

      // Update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No orders found</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
          <Link 
            to="/products" 
            className="btn-primary"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order # {order._id}</h3>
                  <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-gray-700">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Payment Method</h4>
                  <p className="text-gray-700">
                    {order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                     order.paymentMethod === 'mobile banking' ? 'Mobile Banking' :
                     order.paymentMethod === 'cash on delivery' ? 'Cash on Delivery' :
                     order.paymentMethod === 'internal' ? 'Internal Account' :
                     order.paymentMethod}
                  </p>
                  <p className={`mt-1 ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Not Paid'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="space-y-3">
                  {order.orderItems.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t border-gray-200 pt-4">
                <div>
                  <p className="text-gray-700">
                    Total: <span className="font-bold">${order.totalPrice.toFixed(2)}</span>
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  <Link
                    to={`/order/${order._id}`}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    View Details
                  </Link>

                  {/* Show "Pay Now" button for unpaid orders with internal payment method */}
                  {!order.isPaid && order.paymentMethod === 'internal' && (
                    <button
                      onClick={() => processInternalPayment(order._id, order.totalPrice)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Pay Now
                    </button>
                  )}

                  {/* Show "Pay Now" button for unpaid orders with card payment method (in case webhook failed) */}
                  {!order.isPaid && order.paymentMethod === 'card' && (
                    <button
                      onClick={() => processCardPayment(order._id, order.totalPrice)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Complete Payment
                    </button>
                  )}

                  {/* Show "Received" button only for sent orders that haven't been received yet */}
                  {order.status === 'sent' && !order.isReceived && (
                    <button
                      onClick={() => markAsReceived(order._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Received
                    </button>
                  )}

                  {/* Show "Mark as Delivered" button for sellers with shipped orders */}
                  {isSellerOfOrder(order) && order.status === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}

                  {/* Show "Mark as Shipped" button for sellers with processing orders */}
                  {isSellerOfOrder(order) && order.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'shipped')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark as Shipped
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;