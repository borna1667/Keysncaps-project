import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client;
let db;

// MongoDB connection URI
const getMongoURI = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  
  // Construct URI from individual components
  const user = process.env.MONGODB_USER || '';
  const password = process.env.MONGODB_PASSWORD || '';
  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  const dbName = process.env.MONGODB_DB_NAME || 'keysncaps_db';
  
  if (user && password) {
    return `mongodb://${user}:${password}@${host}:${port}/${dbName}`;
  } else {
    return `mongodb://${host}:${port}/${dbName}`;
  }
};

// MongoDB client options
const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false, // Changed from true to false to allow text indexes
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

export const connectDB = async () => {
  try {
    const uri = getMongoURI();
    
    if (!uri) {
      throw new Error('MongoDB connection string is required');
    }

    console.log('Connecting to MongoDB...');
    
    // Create a MongoClient
    client = new MongoClient(uri, clientOptions);
    
    // Connect the client to the server
    await client.connect();
    
    // Get database instance
    const dbName = process.env.MONGODB_DB_NAME || 'keysncaps_db';
    db = client.db(dbName);
    
    // Send a ping to confirm a successful connection
    await db.admin().ping();
    console.log(`✅ Successfully connected to MongoDB database: ${dbName}`);
    
    return db;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

export const getClient = () => {
  if (!client) {
    throw new Error('MongoDB client not initialized. Call connectDB first.');
  }
  return client;
};

// Handle application termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
