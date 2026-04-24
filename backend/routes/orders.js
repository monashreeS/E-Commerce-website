
const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders  - place an order from cart items
router.post('/', protect, async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Cart is empty' });
    const order = await Order.create({
      userId: req.user._id,
      customerName: req.user.name,
      items,
      total,
    });
    res.status(201).json({ order });
  } catch (err) {
    console.error('[orders.create]', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// GET /api/orders/me
router.get('/me', protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

// GET /api/orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  res.json({ orders });
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ order: o });
});

module.exports = router;
