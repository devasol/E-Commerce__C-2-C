import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../services/api';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaTruck, FaFileInvoiceDollar, FaTimesCircle } from 'react-icons/fa';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: authState } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getById(id!);
        setOrder(response.data.data);
      } catch (error) {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
        if (id) document.title = `Order #${id.substring(id.length - 8)} — E-Shop`;
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/orders/${id}/seller-update`, { status: newStatus });
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const isSellerOfOrder = () => {
    if (!order || !authState.user) return false;
    return order.orderItems.some((item: any) => item.product?.seller?._id === authState.user?._id);
  };

  const markAsReceived = async () => {
    if (!order) return;
    try {
      await orderAPI.markAsReceived(id!);
      setOrder((prev: any) => ({ ...prev, isDelivered: true, status: 'delivered', deliveredAt: new Date().toISOString() }));
      toast.success('Order marked as received!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark as received');
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-surface-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Order Details</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="text-center p-12 glass-card rounded-[3rem]">
          <h2 className="text-3xl font-display font-bold text-surface-900 mb-4">Order Not Found</h2>
          <Link to="/order-history" className="btn-premium-primary"><FaArrowLeft className="mr-2" /> Back to History</Link>
        </div>
      </div>
    );
  }

  const status = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-surface-50 pt-10 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/order-history" className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-surface-500 hover:text-primary-600 transition-colors">
            <FaArrowLeft />
          </Link>
          <h1 className="text-3xl font-display font-bold text-surface-900">Order Details</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header Summary Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-surface-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-surface-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-primary-600 bg-primary-50 p-2.5 rounded-xl text-xl"><FaBox /></span>
                  <div>
                    <h2 className="text-2xl font-bold text-surface-900 leading-none">Order #{order._id.substring(order._id.length - 8)}</h2>
                    <p className="text-surface-400 font-mono text-xs mt-1">{order._id}</p>
                  </div>
                </div>
                <p className="text-surface-500 text-sm font-medium pl-14 mt-2">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-3 pl-14 md:pl-0">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${status.color}`}>
                  {status.text}
                </span>
                <p className="text-4xl font-extrabold text-primary-600">${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {/* Shipping */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><FaMapMarkerAlt /></div>
                <div>
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Shipping Information</h3>
                  <div className="space-y-1 text-sm font-medium text-surface-900">
                    <p className="font-bold text-base">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && <p className="text-surface-500 mt-2">📞 {order.shippingAddress.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0"><FaCreditCard /></div>
                <div>
                  <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Payment Details</h3>
                  <div className="space-y-2 text-sm font-medium text-surface-900">
                    <p className="capitalize text-base font-bold">{order.paymentMethod === 'telebirr' ? 'TeleBirr' : order.paymentMethod}</p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${order.isPaid ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {order.isPaid ? <FaCheckCircle /> : <FaTimesCircle />} {order.isPaid ? 'Payment Confirmed' : 'Payment Pending'}
                    </div>
                    {order.paidAt && <p className="text-surface-500 text-xs">on {new Date(order.paidAt).toLocaleDateString()}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-premium border border-surface-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-surface-100 bg-surface-50">
                <h3 className="text-lg font-bold text-surface-900">Order Items ({order.orderItems.length})</h3>
              </div>
              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar flex-grow">
                {order.orderItems.map((item: any, i: number) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-surface-100 hover:border-primary-200 transition-colors">
                    <div className="w-20 h-20 bg-surface-50 rounded-xl overflow-hidden shrink-0 border border-surface-100">
                      <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                      <h4 className="font-bold text-surface-900">{item.name}</h4>
                      <p className="text-surface-500 text-sm mt-1">Quantity: <span className="font-bold text-surface-700">{item.quantity}</span></p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end justify-center pt-2 sm:pt-0 border-t sm:border-0 border-surface-100 mt-2 sm:mt-0">
                      <p className="text-lg font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-surface-400 font-medium">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* Cost Summary */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-surface-100">
                <div className="flex items-center gap-2 mb-6">
                  <FaFileInvoiceDollar className="text-primary-500 text-xl" />
                  <h3 className="text-lg font-bold text-surface-900">Summary</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-surface-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-surface-900">${order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-500 font-medium">
                    <span>Tax</span>
                    <span className="text-surface-900">${order.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-surface-900">${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-surface-100 pt-4 flex justify-between font-bold text-2xl">
                    <span className="text-surface-900">Total</span>
                    <span className="text-primary-600">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions & Status */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-surface-100">
                <div className="flex items-center gap-2 mb-6">
                  <FaTruck className="text-primary-500 text-xl" />
                  <h3 className="text-lg font-bold text-surface-900">Actions</h3>
                </div>

                <div className="space-y-4">
                  {!order.isDelivered && (order.status === 'shipped' || order.status === 'sent') && (
                    <button onClick={markAsReceived} disabled={updatingStatus} className="btn-premium-primary w-full !py-3 !bg-green-500 hover:!bg-green-600 !shadow-none">
                      {updatingStatus ? 'Processing...' : 'Mark as Received'}
                    </button>
                  )}

                  {isSellerOfOrder() && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Update Order Status</label>
                      <select
                        value=""
                        onChange={(e) => { if (e.target.value) updateOrderStatus(e.target.value); }}
                        disabled={updatingStatus}
                        className="input-premium appearance-none !py-3 font-bold text-surface-600"
                      >
                        <option value="">Select New Status...</option>
                        {order.status === 'pending' && <option value="processing">Processing</option>}
                        {order.status === 'pending' && <option value="cancelled">Cancelled</option>}
                        {(order.status === 'pending' || order.status === 'processing') && <option value="shipped">Shipped</option>}
                        {(order.status === 'shipped' || order.status === 'processing') && <option value="sent">Sent</option>}
                        {(order.status === 'shipped' || order.status === 'sent' || order.status === 'processing') && <option value="delivered">Delivered</option>}
                        {(order.status !== 'cancelled' && order.status !== 'delivered') && <option value="cancelled">Cancel Order</option>}
                      </select>
                    </div>
                  )}

                  {!(!order.isDelivered && (order.status === 'shipped' || order.status === 'sent')) && !isSellerOfOrder() && order.status === 'delivered' && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 text-sm font-bold text-center flex flex-col items-center gap-2">
                      <FaCheckCircle className="text-2xl" />
                      Order Complete
                      {order.deliveredAt && <span className="font-normal text-xs text-green-600/80">Delivered {new Date(order.deliveredAt).toLocaleDateString()}</span>}
                    </div>
                  )}
                  
                  {!(!order.isDelivered && (order.status === 'shipped' || order.status === 'sent')) && !isSellerOfOrder() && order.status !== 'delivered' && (
                    <div className="p-4 bg-surface-50 text-surface-500 rounded-xl border border-surface-100 text-sm font-bold text-center">
                      No actions available for this order state.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;