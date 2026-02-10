const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./db');

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
    
    // Try to count documents (this will create collection if it doesn't exist)
    const count = await users.countDocuments();
    
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      collection: 'users',
      documentCount: count
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
