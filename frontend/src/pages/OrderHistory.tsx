import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../services/api';

// Mock data for orders
const mockOrders = [
  {
    _id: '1',
    orderItems: [
      { name: 'Wireless Bluetooth Headphones', quantity: 1, image: 'https://via.placeholder.com/100x100' },
      { name: 'Laptop Backpack', quantity: 2, image: 'https://via.placeholder.com/100x100' }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      city: 'New York',
      state: 'NY'
    },
    paymentMethod: 'card',
    itemsPrice: 199.97,
    taxPrice: 15.99,
    shippingPrice: 5.99,
    totalPrice: 221.95,
    isPaid: true,
    paidAt: '2023-09-15T10:30:00.000Z',
    isDelivered: true,
    deliveredAt: '2023-09-20T14:45:00.000Z',
    status: 'delivered',
    createdAt: '2023-09-15T10:00:00.000Z'
  },
  {
    _id: '2',
    orderItems: [
      { name: 'Smart Watch Series 5', quantity: 1, image: 'https://via.placeholder.com/100x100' }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      city: 'New York',
      state: 'NY'
    },
    paymentMethod: 'cash on delivery',
    itemsPrice: 199.99,
    taxPrice: 15.99,
    shippingPrice: 5.99,
    totalPrice: 221.97,
    isPaid: false,
    isDelivered: false,
    status: 'processing',
    createdAt: '2023-09-20T11:15:00.000Z'
  }
];

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, this would be: const response = await orderAPI.getMyOrders();
        // For now, using mock data
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
          document.title = 'Order History - E-Shop';
        }, 1000);
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
                     'Cash on Delivery'}
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
                
                <div className="mt-4 md:mt-0">
                  <Link 
                    to={`/order/${order._id}`} 
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    View Details
                  </Link>
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