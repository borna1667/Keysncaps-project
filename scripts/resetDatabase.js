import { connectDB, disconnectDB } from '../config/database.js';
import { User, Product, Order, OrderItem, Shipment, Inventory } from '../models/index.js';

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Drop all collections
    console.log('🗑️  Dropping all collections...');
    
    const db = (await import('../config/database.js')).getDB();
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`✅ Dropped collection: ${collection.name}`);
    }
    
    console.log('🎉 Database reset completed successfully!');
    console.log('ℹ️  Run "npm run db:init" to recreate collections');
    console.log('ℹ️  Run "npm run db:seed" to populate with sample data');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

resetDatabase().catch(console.error);
