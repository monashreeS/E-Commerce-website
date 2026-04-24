const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- MongoDB Connection ---------------- */
mongoose.connect(process.env.MONGO_CONN)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Error:', err));

/* ---------------- Route Imports ---------------- */
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

/* ---------------- API Routes ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

/* ---------------- Test Route ---------------- */
app.get('/', (req, res) => {
  res.send('Backend Server Running...');
});

/* ---------------- Server Start ---------------- */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});