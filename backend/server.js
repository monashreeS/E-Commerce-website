
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seed = require('./seed');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'edutech-api' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.use((err, req, res, next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = Number(process.env.NODE_PORT || 8002);

(async () => {
  await connectDB();
  await seed();
  app.listen(PORT, '127.0.0.1', () =>
    console.log(`[express] Listening on http://127.0.0.1:${PORT}`)
  );
})();
