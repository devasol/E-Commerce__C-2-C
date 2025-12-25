import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, orderAPI } from '../../services/api';
import { FaShoppingCart, FaDollarSign, FaBox, FaChartBar } from 'react-icons/fa';

// Mock data for seller dashboard
const mockSellerStats = {
  totalProducts: 12,
  totalOrders: 24,
  totalRevenue: 4567.89,
  pendingOrders: 5,
  recentOrders: [
    { _id: '1', user: { name: 'John Doe' }, total: 129.99, date: '2023-09-20', status: 'delivered' },
    { _id: '2', user: { name: 'Jane Smith' }, total: 89.50, date: '2023-09-19', status: 'processing' },
    { _id: '3', user: { name: 'Bob Johnson' }, total: 249.99, date: '2023-09-18', status: 'shipped' },
  ],
  topSellingProducts: [
    { _id: '1', name: 'Wireless Headphones', sold: 15 },
    { _id: '2', name: 'Laptop Backpack', sold: 8 },
  ]
};

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, this would make API calls to get seller-specific stats
        // For now, using mock data
        setTimeout(() => {
          setStats(mockSellerStats);
          setLoading(false);
          document.title = 'Seller Dashboard - E-Shop';
        }, 1000);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaBox className="text-blue-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaShoppingCart className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <FaChartBar className="text-yellow-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 flex items-center"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaDollarSign className="text-purple-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/seller/products" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBox className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
          <p className="text-gray-600">Add, edit, or remove your products</p>
        </Link>
        
        <Link to="/seller/orders" className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartBar className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">View Orders</h3>
          <p className="text-gray-600">Manage your product orders</p>
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaDollarSign className="text-purple-600 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Sales Reports</h3>
          <p className="text-gray-600">View your sales analytics</p>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order: any) => (
              <div key={order._id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">Order #{order._id}</p>
                  <p className="text-gray-600 text-sm">{order.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {stats.topSellingProducts.map((product: any) => (
              <div key={product._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-600 text-sm">{product.sold} sold</p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {product.sold} sold
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;