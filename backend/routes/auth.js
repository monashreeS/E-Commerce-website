const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  branch: u.branch,
  phone: u.phone || '',
  role: u.role,
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    const emailLc = email.toLowerCase().trim();

    const existing = await User.findOne({ email: emailLc });

    if (existing) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: emailLc,
      password: hashed,
      branch: branch || 'CSE'
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: sanitize(user)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Signup failed'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: sanitize(user)
    });

  } catch (err) {
    res.status(500).json({
      message: 'Login failed'
    });
  }
});

// Current user
router.get('/me', protect, (req, res) => {
  res.json({
    user: sanitize(req.user)
  });
});

module.exports = router;