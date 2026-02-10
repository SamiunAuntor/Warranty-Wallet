const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not set in .env');
  process.exit(1);
}

const client = new MongoClient(uri);

let db;
let isConnected = false;

async function connectDB() {
  if (isConnected && db) {
    return db;
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    await client.connect();
    console.log('✅ MongoDB client connected');
    
    const dbName = process.env.DB_NAME || 'warranty_wallet';
    console.log(`📦 Using database: ${dbName}`);
    db = client.db(dbName);
    isConnected = true;
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log(`📋 Existing collections: ${collections.map(c => c.name).join(', ') || 'none (will be created on first write)'}`);
    
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if your MongoDB Atlas cluster is running');
    console.error('2. Verify your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Check your connection string format in .env file');
    console.error('4. Ensure your MongoDB username and password are correct');
    throw error;
  }
}

async function getUsersCollection() {
  const database = await connectDB();
  const collection = database.collection('users');
  console.log('📂 Accessing users collection (will be created if it doesn\'t exist)');
  return collection;
}

async function getProductsCollection() {
  const database = await connectDB();
  const collection = database.collection('products');
  console.log('📂 Accessing products collection (will be created if it doesn\'t exist)');
  return collection;
}

async function getInvoicesCollection() {
  const database = await connectDB();
  const collection = database.collection('invoices');
  console.log('📂 Accessing invoices collection (will be created if it doesn\'t exist)');
  return collection;
}

async function getRemindersCollection() {
  const database = await connectDB();
  const collection = database.collection('reminders');
  console.log('📂 Accessing reminders collection (will be created if it doesn\'t exist)');
  return collection;
}

async function getReminderLogsCollection() {
  const database = await connectDB();
  const collection = database.collection('reminder_logs');
  console.log('📂 Accessing reminder_logs collection (will be created if it doesn\'t exist)');
  return collection;
}

module.exports = {
  connectDB,
  getUsersCollection,
  getProductsCollection,
  getInvoicesCollection,
  getRemindersCollection,
  getReminderLogsCollection,
};


