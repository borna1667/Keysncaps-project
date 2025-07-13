import { connectDB, disconnectDB } from '../config/database.js';
import { User, Product, Order, OrderItem, Shipment, Inventory } from '../models/index.js';

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Create collections with indexes
    const db = (await import('../config/database.js')).getDB();
    
    // Users collection
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    console.log('✅ Users collection created with indexes');
    
    // Products collection
    await db.createCollection('products');
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ featured: 1 });
    await db.collection('products').createIndex({ newArrival: 1 });
    await db.collection('products').createIndex({ isActive: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ 
      name: 'text', 
      description: 'text', 
      category: 'text' 
    });
    console.log('✅ Products collection created with indexes');
    
    // Orders collection
    await db.createCollection('orders');
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ paymentStatus: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    console.log('✅ Orders collection created with indexes');
    
    // Order Items collection
    await db.createCollection('orderItems');
    await db.collection('orderItems').createIndex({ orderId: 1 });
    await db.collection('orderItems').createIndex({ productId: 1 });
    console.log('✅ OrderItems collection created with indexes');
    
    // Shipments collection
    await db.createCollection('shipments');
    await db.collection('shipments').createIndex({ orderId: 1 });
    await db.collection('shipments').createIndex({ trackingNumber: 1 });
    await db.collection('shipments').createIndex({ status: 1 });
    console.log('✅ Shipments collection created with indexes');
    
    // Inventory collection
    await db.createCollection('inventory');
    await db.collection('inventory').createIndex({ productId: 1 }, { unique: true });
    console.log('✅ Inventory collection created with indexes');
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

initDatabase().catch(console.error);
