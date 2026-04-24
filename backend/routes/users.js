const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  branch: u.branch,
  phone: u.phone || '',
  role: u.role,
});

// GET current user profile
router.get('/me', protect, (req, res) => {
  res.json({ user: sanitize(req.user) });
});

// GET all users (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users: users.map(sanitize) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// UPDATE user profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    );
    
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// DELETE user (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
