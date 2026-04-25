import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderAPI, accountAPI } from '../services/api';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { FaBox, FaArrowRight, FaCreditCard, FaMoneyBillWave, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';

const OrderHistory: React.FC = () => {
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getMyOrders();
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
        document.title = 'Order History — E-Shop';
      }
    };
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'bg-yellow-50 text-yellow-600 border-yellow-200', text: 'Pending' };
      case 'processing': return { color: 'bg-blue-50 text-blue-600 border-blue-200', text: 'Processing' };
      case 'shipped': return { color: 'bg-indigo-50 text-indigo-600 border-indigo-200', text: 'Shipped' };
      case 'sent': return { color: 'bg-purple-50 text-purple-600 border-purple-200', text: 'Sent' };
      case 'delivered': return { color: 'bg-green-50 text-green-600 border-green-200', text: 'Delivered' };
      case 'cancelled': return { color: 'bg-red-50 text-red-600 border-red-200', text: 'Cancelled' };
      default: return { color: 'bg-surface-100 text-surface-600 border-surface-200', text: status };
    }
  };

  const markAsReceived = async (orderId: string) => {
    try {
      await orderAPI.markAsReceived(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, isReceived: true, status: 'received', receivedAt: new Date().toISOString() } : o));
      toast.success('Order marked as received successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark order as received');
    }
  };

  const processInternalPayment = async (orderId: string, amount: number) => {
    try {
      const response = await accountAPI.processAccountPayment(orderId, amount);
      if (response.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, isPaid: true, paidAt: new Date().toISOString() } : o));
        toast.success('Payment processed successfully!');
      } else {
        toast.error(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error processing payment');
    }
  };

  const processCardPayment = async (orderId: string, amount: number) => {
    window.location.href = `/checkout?orderId=${orderId}`;
  };

  const isSellerOfOrder = (order: any) => {
    if (!order?.orderItems) return false;
    return order.orderItems.some((item: any) => item.product?.seller?._id === authState.user?._id);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/seller-update`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-surface-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Orders</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-10 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-display font-bold text-surface-900">
            Order <span className="text-gradient">History</span>
          </h1>
          <p className="text-surface-500 mt-2 text-lg">Track, manage and review your purchases</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 glass-card rounded-[3rem]">
            <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary-300 text-5xl">
              <FaShoppingBag />
            </div>
            <h2 className="text-3xl font-display font-bold text-surface-900 mb-3">No orders found</h2>
            <p className="text-surface-500 mb-10 text-lg">You haven't placed any orders yet. Ready to start?</p>
            <Link to="/products" className="btn-premium-primary text-base !px-10 !py-4 inline-flex">
              Start Shopping <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => {
                const status = getStatusInfo(order.status);
                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-[2rem] shadow-premium border border-surface-100 overflow-hidden group hover:shadow-premium-hover transition-shadow duration-500"
                  >
                    {/* Header */}
                    <div className="bg-surface-50/50 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-100">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-primary-600 bg-primary-50 p-2 rounded-xl"><FaBox /></span>
                          <h3 className="text-xl font-display font-bold text-surface-900">Order #{order._id.substring(order._id.length - 8)}</h3>
                        </div>
                        <p className="text-surface-500 text-sm font-medium pl-11">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2 md:pl-0 pl-11">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${status.color}`}>
                          {status.text}
                        </span>
                        <p className="text-2xl font-extrabold text-surface-900">${order.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Address */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Shipping To</h4>
                          <p className="font-bold text-surface-900">{order.shippingAddress.fullName}</p>
                          <p className="text-surface-600 text-sm">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                          <p className="text-surface-600 text-sm">{order.shippingAddress.state}, {order.shippingAddress.country}</p>
                        </div>
                        
                        {/* Payment */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Payment Info</h4>
                          <div className="flex items-center gap-2">
                            {order.paymentMethod === 'card' || order.paymentMethod === 'telebirr' ? <FaCreditCard className="text-surface-400" /> : <FaMoneyBillWave className="text-surface-400" />}
                            <span className="font-bold text-surface-900 capitalize text-sm">{order.paymentMethod === 'telebirr' ? 'TeleBirr' : order.paymentMethod}</span>
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${order.isPaid ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {order.isPaid ? <FaCheckCircle /> : null} {order.isPaid ? 'Payment Complete' : 'Awaiting Payment'}
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex flex-wrap gap-4 mb-8">
                        {order.orderItems.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 bg-surface-50 pr-4 rounded-xl border border-surface-100 overflow-hidden w-full sm:w-auto">
                            <div className="w-16 h-16 bg-white shrink-0 p-2">
                              <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="py-2">
                              <p className="text-sm font-bold text-surface-900 truncate max-w-[150px]">{item.name}</p>
                              <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-surface-100">
                        <Link to={`/order/${order._id}`} className="btn-premium-outline !py-2.5 text-sm">
                          View Full Details
                        </Link>

                        {!order.isPaid && order.paymentMethod === 'internal' && (
                          <button onClick={() => processInternalPayment(order._id, order.totalPrice)} className="btn-premium-primary !py-2.5 text-sm !px-6">Pay ${order.totalPrice.toFixed(2)} Now</button>
                        )}
                        {!order.isPaid && order.paymentMethod === 'card' && (
                          <button onClick={() => processCardPayment(order._id, order.totalPrice)} className="btn-premium-primary !py-2.5 text-sm !px-6">Complete Payment</button>
                        )}
                        {!order.isPaid && order.paymentMethod === 'telebirr' && (
                          <button onClick={() => processCardPayment(order._id, order.totalPrice)} className="btn-premium-primary !py-2.5 text-sm !px-6">Complete TeleBirr Payment</button>
                        )}

                        {order.status === 'sent' && !order.isReceived && (
                          <button onClick={() => markAsReceived(order._id)} className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow-md">
                            Confirm Delivery
                          </button>
                        )}

                        {isSellerOfOrder(order) && order.status === 'shipped' && (
                          <button onClick={() => updateOrderStatus(order._id, 'delivered')} className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm rounded-xl transition-all">
                            Mark as Delivered
                          </button>
                        )}

                        {isSellerOfOrder(order) && order.status === 'processing' && (
                          <button onClick={() => updateOrderStatus(order._id, 'shipped')} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all">
                            Mark as Shipped
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;