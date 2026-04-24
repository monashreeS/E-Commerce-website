const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and attach user to request
const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided' 
      });
    }
    //..
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    next();
    
  } catch (err) {
    console.error('[auth.protect]', err.message);
    res.status(401).json({ 
      message: 'Authentication failed' 
    });
  }
};

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required' 
    });
  }
  next();
};

module.exports = { protect, adminOnly };
