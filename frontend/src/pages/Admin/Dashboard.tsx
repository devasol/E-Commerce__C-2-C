import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { FaShoppingCart, FaDollarSign, FaUsers, FaBox, FaChartBar, FaChartLine, FaCog } from 'react-icons/fa';

// Mock data for dashboard
const mockStats = {
  totalUsers: 124,
  totalProducts: 56,
  totalOrders: 89,
  totalRevenue: 24567.89,
  recentOrders: [
    { _id: '1', user: { name: 'John Doe' }, total: 129.99, date: '2023-09-20', status: 'delivered' },
    { _id: '2', user: { name: 'Jane Smith' }, total: 89.50, date: '2023-09-19', status: 'processing' },
    { _id: '3', user: { name: 'Bob Johnson' }, total: 249.99, date: '2023-09-18', status: 'shipped' },
    { _id: '4', user: { name: 'Alice Williams' }, total: 199.99, date: '2023-09-17', status: 'delivered' },
    { _id: '5', user: { name: 'Charlie Brown' }, total: 79.99, date: '2023-09-16', status: 'cancelled' },
  ],
  topSellingProducts: [
    { _id: '1', name: 'Wireless Headphones', sold: 45 },
    { _id: '2', name: 'Smart Watch', sold: 32 },
    { _id: '3', name: 'Laptop Backpack', sold: 28 },
    { _id: '4', name: 'Gaming Mouse', sold: 22 },
    { _id: '5', name: 'Wireless Keyboard', sold: 18 },
  ]
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, this would be: const response = await adminAPI.getDashboardStats();
        // For now, using mock data
        setTimeout(() => {
          setStats(mockStats);
          setLoading(false);
          document.title = 'Admin Dashboard - E-Shop';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage your e-commerce platform efficiently
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <FaBox className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-yellow-100 p-4 rounded-full mr-4">
                <FaShoppingCart className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-100 p-4 rounded-full mr-4">
                <FaDollarSign className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/admin/products" className="block bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Manage Products</h3>
                <p className="text-gray-600">Add, edit, or remove products</p>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/admin/orders" className="block bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartBar className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">View Orders</h3>
                <p className="text-gray-600">Manage customer orders</p>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/admin/users" className="block bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Manage Users</h3>
                <p className="text-gray-600">View and manage users</p>
              </Link>
            </motion.div>
          </div>

          {/* Additional Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/admin/reports" className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <FaChartLine className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sales Reports</h3>
                    <p className="text-gray-600">View detailed sales analytics</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/admin/settings" className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-3 rounded-full mr-4">
                    <FaCog className="text-gray-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                    <p className="text-gray-600">Configure platform settings</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Recent Orders and Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order._id}</p>
                      <p className="text-gray-600 text-sm">{order.user.name}</p>
                      <p className="text-gray-500 text-sm">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-gray-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Selling Products</h2>
                <Link to="/admin/products" className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>
              <div className="space-y-4">
                {stats.topSellingProducts.map((product: any) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-gray-600 text-sm">{product.sold} units sold</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                      {product.sold} sold
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;