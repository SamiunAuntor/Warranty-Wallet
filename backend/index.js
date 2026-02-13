const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

require('./firebaseAdmin');


const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { connectDB } = require('./db');
const { startDailyReminderJob } = require('./jobs/dailyReminderCheck');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Warranty Wallet API' });
});

// Test endpoint to verify database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { getUsersCollection } = require('./db');
    const users = await getUsersCollection();

    const count = await users.countDocuments();

    res.json({
      status: 'ok',
      message: 'Database connection successful',
      collection: 'users',
      documentCount: count,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

app.use('/api/public', publicRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Define PORT (Add this line!)
const PORT = process.env.PORT || 5000;

// Start DB connection
connectDB().catch(err => console.error(err));
startDailyReminderJob();

// Local Development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Required for Vercel
module.exports = app;