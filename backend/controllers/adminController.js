const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc      Get admin dashboard stats
// @route     GET /api/admin/dashboard
// @access    Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get basic stats
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // Get top selling products
    const topSellingProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5);

    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
      recentOrders,
      topSellingProducts
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Get sales report
// @route     GET /api/admin/reports/sales
// @access    Private/Admin
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.createdAt = dateFilter.createdAt || {};
      dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get sales data
    const salesData = await Order.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Get top selling products
// @route     GET /api/admin/reports/top-products
// @access    Private/Admin
exports.getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(parseInt(limit))
      .select('name price stock sold ratings');

    res.status(200).json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc      Get recent orders
// @route     GET /api/admin/reports/recent-orders
// @access    Private/Admin
exports.getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .select('user orderItems totalPrice status createdAt');

    res.status(200).json({
      success: true,
      data: recentOrders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};