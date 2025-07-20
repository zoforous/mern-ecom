const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total counts
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();

  // Get total revenue
  const orders = await Order.find({ isPaid: true });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  // Get recent orders
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name');

  // Get top products by sales
  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSales: { $sum: '$orderItems.quantity' }
      }
    },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: '$product._id',
        name: '$product.name',
        totalSales: 1
      }
    }
  ]);

  res.json({
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue
    },
    recentOrders,
    topProducts
  });
});

module.exports = {
  getDashboardStats
}; 