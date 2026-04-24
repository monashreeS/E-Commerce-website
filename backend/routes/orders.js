const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (err) {
    console.error('[orders.list]', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json({ order });
  } catch (err) {
    res.status(400).json({ message: 'Invalid order id' });
  }
});

// POST create order
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.user._id,
      ...req.body
    });
    
    res.status(201).json({ order });
  } catch (err) {
    console.error('[orders.create]', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

module.exports = router;
