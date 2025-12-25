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