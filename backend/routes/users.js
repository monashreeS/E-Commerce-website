
const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// PUT /api/users/me - update profile
router.put('/me', protect, async (req, res) => {
  const { name, branch, phone } = req.body;
  const u = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(branch && { branch }), ...(phone !== undefined && { phone }) },
    { new: true }
  ).select('-password');
  res.json({ user: u });
});

// Wishlist
router.get('/me/wishlist', protect, async (req, res) => {
  const u = await User.findById(req.user._id).populate('wishlist');
  res.json({ wishlist: u.wishlist });
});

router.post('/me/wishlist/:productId', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { wishlist: req.params.productId },
  });
  res.json({ message: 'Added to wishlist' });
});

router.delete('/me/wishlist/:productId', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } });
  res.json({ message: 'Removed from wishlist' });
});

// Admin: users list
router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(200);
  res.json({ users });
});

// Admin analytics
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  const [totalProducts, totalUsers, totalOrders, revenueAgg] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);
  const revenue = revenueAgg[0]?.total || 0;
  res.json({ totalProducts, totalUsers, totalOrders, revenue });
});

module.exports = router;
