import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI, accountAPI } from '../services/api';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getById(id!);
        setOrder(response.data.data);
        setLoading(false);
        document.title = `Order #${id} - E-Shop`;
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
        toast.error('Failed to load order details');
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdatingStatus(true);
    try {
      const response = await api.put(`/orders/${id}/seller-update`, { status: newStatus });

      // Update the order in the local state
      setOrder((prevOrder: any) => ({
        ...prevOrder,
        status: newStatus
      }));

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Check if the current user is a seller of any product in this order
  const isSellerOfOrder = () => {
    if (!order || !authState.user || !authState.user._id) return false;

    const userId = authState.user._id;

    // Check if any of the products in the order belong to the current user
    return order.orderItems.some((item: any) =>
      item.product && item.product.seller &&
      item.product.seller._id === userId
    );
  };


  const markAsReceived = async () => {
    if (!order) return;

    try {
      await orderAPI.markAsReceived(id!);
      // Update the order in the local state
      setOrder((prevOrder: any) => ({
        ...prevOrder,
        isDelivered: true,
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      }));
      toast.success('Order marked as received successfully!');
    } catch (error: any) {
      console.error('Error marking order as received:', error);
      toast.error(error.response?.data?.message || 'Failed to mark order as received');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/order-history" className="btn-primary">
          Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Link to="/order-history" className="text-blue-600 hover:text-blue-800">
          ← Back to Orders
        </Link>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow-md p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Order # {order._id}</h2>
            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">
                {order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                 order.paymentMethod === 'mobile banking' ? 'Mobile Banking' :
                 order.paymentMethod === 'cash on delivery' ? 'Cash on Delivery' :
                 order.paymentMethod === 'internal' ? 'Internal Account' :
                 order.paymentMethod === 'telebirr' ? 'TeleBirr Payment' :
                 order.paymentMethod}
              </p>
              <p className={`mt-1 ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                {order.isPaid ? 'Paid' : 'Not Paid'}
              </p>
              {order.paidAt && (
                <p className="text-sm text-gray-600">Paid on {new Date(order.paidAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.orderItems.map((item: any, index: number) => (
            <div key={index} className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              {item.image && (
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Order Status</h3>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gray-700">
              Current Status: <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </p>
            {order.deliveredAt && (
              <p className="text-sm text-gray-600 mt-1">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">

            {/* Show "Received" button only for buyers with shipped/sent orders that haven't been delivered yet */}
            {!order.isDelivered && (order.status === 'shipped' || order.status === 'sent') && (
              <button
                onClick={markAsReceived}
                disabled={updatingStatus}
                className={`px-4 py-2 rounded-lg ${
                  updatingStatus
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {updatingStatus ? 'Processing...' : 'Mark as Received'}
              </button>
            )}

            {/* Show status update buttons for sellers */}
            {isSellerOfOrder() && (
              <>
                {/* Show status update dropdown for sellers */}
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      updateOrderStatus(e.target.value);
                      e.target.value = ""; // Reset the dropdown
                    }
                  }}
                  disabled={updatingStatus}
                  className={`px-4 py-2 rounded-lg ${
                    updatingStatus
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <option value="">Update Status...</option>
                  {order.status === 'pending' && <option value="processing">Processing</option>}
                  {order.status === 'pending' && <option value="cancelled">Cancelled</option>}
                  {(order.status === 'pending' || order.status === 'processing') && <option value="shipped">Shipped</option>}
                  {(order.status === 'shipped' || order.status === 'processing') && <option value="sent">Sent</option>}
                  {(order.status === 'shipped' || order.status === 'sent' || order.status === 'processing') && <option value="delivered">Delivered</option>}
                  {(order.status !== 'cancelled' && order.status !== 'delivered') && <option value="cancelled">Cancel Order</option>}
                </select>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;