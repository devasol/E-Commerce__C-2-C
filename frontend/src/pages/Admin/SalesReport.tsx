import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { FaCalendarAlt, FaDollarSign, FaChartBar, FaChartLine } from 'react-icons/fa';

const SalesReport: React.FC = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    fetchSalesReport();
  }, [dateRange]);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSalesReport(dateRange.startDate, dateRange.endDate);
      const data = response.data.data;

      // Calculate summary
      const totalSales = data.reduce((sum: number, item: any) => sum + item.totalSales, 0);
      const totalOrders = data.reduce((sum: number, item: any) => sum + item.orderCount, 0);
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      setSummary({
        totalSales,
        totalOrders,
        averageOrderValue
      });

      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalesReport();
  };

  // Prepare data for charts
  const chartData = salesData.map(item => ({
    date: item._id,
    sales: item.totalSales,
    orders: item.orderCount
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  if (loading && salesData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Sales Reports
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Analyze your sales performance and trends
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
          {/* Date Range Filter */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Filter by Date Range
            </h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filter
                </button>
              </div>
            </form>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={itemVariants}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <FaDollarSign className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">${summary.totalSales.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <FaChartBar className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{summary.totalOrders}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="bg-purple-100 p-4 rounded-full mr-4">
                <FaChartLine className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Avg. Order Value</p>
                <p className="text-3xl font-bold text-gray-900">${summary.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Trend Chart */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaChartLine className="mr-2 text-blue-600" />
                Sales Trend
              </h3>
              {salesData.length > 0 ? (
                <div className="h-64 overflow-x-auto">
                  <div className="flex items-end h-48 gap-1">
                    {chartData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 min-w-[30px]">
                        <div
                          className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                          style={{ height: `${Math.min(100, (item.sales / Math.max(...chartData.map(d => d.sales))) * 80)}%` }}
                          title={`$${item.sales.toLocaleString()}`}
                        ></div>
                        <div className="text-xs mt-1 truncate w-full text-center">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available for the selected date range
                </div>
              )}
            </motion.div>

            {/* Order Count Chart */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaChartBar className="mr-2 text-green-600" />
                Order Count
              </h3>
              {salesData.length > 0 ? (
                <div className="h-64 overflow-x-auto">
                  <div className="flex items-end h-48 gap-1">
                    {chartData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 min-w-[30px]">
                        <div
                          className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                          style={{ height: `${Math.min(100, (item.orders / Math.max(...chartData.map(d => d.orders))) * 80)}%` }}
                          title={`${item.orders} orders`}
                        ></div>
                        <div className="text-xs mt-1 truncate w-full text-center">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available for the selected date range
                </div>
              )}
            </motion.div>
          </div>

          {/* Sales Data Table */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold mb-4">Sales Data</h3>
            {salesData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chartData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.sales.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(item.orders > 0 ? item.sales / item.orders : 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No sales data available for the selected date range
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesReport;