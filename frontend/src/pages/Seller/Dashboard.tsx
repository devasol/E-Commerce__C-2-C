import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaDollarSign, FaBox, FaChartBar, FaChartLine, FaUserTie } from 'react-icons/fa';

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (authState.user) {
          const response = await productAPI.getSellerStats(authState.user._id);
          setStats(response.data.data);
        }
        setLoading(false);
        document.title = 'Seller Dashboard - E-Shop';
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [authState.user]);

  if (loading || !stats) {
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
              Seller Dashboard
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage your products and sales efficiently
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
                <FaBox className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <FaShoppingCart className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 flex items-center hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-yellow-100 p-4 rounded-full mr-4">
                <FaChartBar className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders || 0}</p>
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
                <p className="text-3xl font-bold text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</p>
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
              <Link to="/seller/products" className="block bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Manage Products</h3>
                <p className="text-gray-600">Add, edit, or remove your products</p>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/seller/orders" className="block bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartBar className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">View Orders</h3>
                <p className="text-gray-600">Manage your product orders</p>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/seller/reports" className="block bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Sales Reports</h3>
                <p className="text-gray-600">View your sales analytics</p>
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
              <Link to="/seller/analytics" className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <FaChartLine className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
                    <p className="text-gray-600">Track your sales performance</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/seller/profile" className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-3 rounded-full mr-4">
                    <FaUserTie className="text-gray-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seller Profile</h3>
                    <p className="text-gray-600">Manage your seller information</p>
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
                <Link to="/seller/orders" className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>
              <div className="space-y-4">
                {stats.recentOrders && stats.recentOrders.length > 0 ?
                  stats.recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order._id || 'N/A'}</p>
                        <p className="text-gray-600 text-sm">{order.user?.name || 'N/A'}</p>
                        <p className="text-gray-500 text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-gray-900">${(order.totalPrice || 0).toFixed(2)}</p>
                        <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))
                  : <p className="text-gray-500 text-center">No recent orders available</p>
                }
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Selling Products</h2>
                <Link to="/seller/products" className="text-blue-600 hover:text-blue-800 font-medium">View All</Link>
              </div>
              <div className="space-y-4">
                {stats.topSellingProducts && stats.topSellingProducts.length > 0 ?
                  stats.topSellingProducts.map((product: any) => (
                    <div key={product._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{product.name || 'N/A'}</p>
                        <p className="text-gray-600 text-sm">{product.sold || 0} units sold</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                        {product.sold || 0} sold
                      </div>
                    </div>
                  ))
                  : <p className="text-gray-500 text-center">No top selling products available</p>
                }
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerDashboard;