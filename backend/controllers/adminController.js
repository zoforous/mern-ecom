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

  // Get monthly sales data for the current year
  const currentYear = new Date().getFullYear();
  const monthlySales = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  // Format monthly sales data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesData = Array(12).fill(0);
  const ordersData = Array(12).fill(0);

  monthlySales.forEach(({ _id, total, count }) => {
    const monthIndex = _id - 1;
    salesData[monthIndex] = total;
    ordersData[monthIndex] = count;
  });

  res.json({
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue
    },
    recentOrders,
    topProducts,
    salesChart: {
      labels: monthNames,
      datasets: [
        {
          label: 'Sales (₹)',
          data: salesData
        },
        {
          label: 'Orders',
          data: ordersData
        }
      ]
    }
  });
});

module.exports = {
  getDashboardStats
}; 