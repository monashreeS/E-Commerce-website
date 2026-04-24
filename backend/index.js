const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ==================== Middleware ==================== */
app.use(cors());
app.use(express.json());

/* ==================== Seed Import ==================== */
const seed = require('./seed');

/* ==================== MongoDB Connection ==================== */
mongoose.connect(process.env.MONGO_CONN)
  .then(async () => {
    console.log('[mongodb] Connected successfully');

    // 🔥 Run seed data
    await seed();
  })
  .catch((err) => {
    console.error('[mongodb] Connection Error:', err.message);
    process.exit(1);
  });

/* ==================== Route Imports ==================== */
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

/* ==================== Health Check ==================== */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'e-commerce-api',
    timestamp: new Date().toISOString()
  });
});

/* ==================== API Routes ==================== */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

/* ==================== 404 Handler ==================== */
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

/* ==================== Global Error Handler ==================== */
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* ==================== Server Start ==================== */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`[express] Server is running on http://localhost:${PORT}`);
  console.log('[env] NODE_ENV:', process.env.NODE_ENV || 'development');
});
