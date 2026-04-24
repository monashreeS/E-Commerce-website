
const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/products  (supports ?category=&search=&min=&max=&featured=&branch=)
router.get('/', async (req, res) => {
  try {
    const { category, search, min, max, featured, branch, limit } = req.query;
    const q = {};
    if (category && category !== 'All') q.category = category;
    if (search) q.name = { $regex: search, $options: 'i' };
    if (min || max) {
      q.price = {};
      if (min) q.price.$gte = Number(min);
      if (max) q.price.$lte = Number(max);
    }
    if (featured === 'true') q.featured = true;
    if (branch) q.branchRecommendation = { $in: [branch, 'ALL'] };
    const products = await Product.find(q).sort({ createdAt: -1 }).limit(Number(limit) || 100);
    res.json({ products });
  } catch (err) {
    console.error('[products.list]', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: p });
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id' });
  }
});

// Admin
router.post('/', protect, adminOnly, async (req, res) => {
  const p = await Product.create(req.body);
  res.status(201).json({ product: p });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ product: p });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
