import { connectDB, disconnectDB } from '../config/database.js';

const migrateDatabase = async () => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    const db = (await import('../config/database.js')).getDB();
    
    // Migration 1: Add missing fields to existing products
    console.log('📦 Migrating products...');
    const productsResult = await db.collection('products').updateMany(
      { isActive: { $exists: false } },
      { 
        $set: { 
          isActive: true,
          views: 0,
          sold: 0,
          updatedAt: new Date()
        }
      }
    );
    console.log(`✅ Updated ${productsResult.modifiedCount} products`);
    
    // Migration 2: Add role field to users without it
    console.log('👥 Migrating users...');
    const usersResult = await db.collection('users').updateMany(
      { role: { $exists: false } },
      { 
        $set: { 
          role: 'user',
          isActive: true,
          updatedAt: new Date()
        }
      }
    );
    console.log(`✅ Updated ${usersResult.modifiedCount} users`);
    
    // Migration 3: Ensure all orders have proper status fields
    console.log('📄 Migrating orders...');
    const ordersResult = await db.collection('orders').updateMany(
      { 
        $or: [
          { status: { $exists: false } },
          { paymentStatus: { $exists: false } }
        ]
      },
      { 
        $set: { 
          status: 'pending',
          paymentStatus: 'pending',
          updatedAt: new Date()
        }
      }
    );
    console.log(`✅ Updated ${ordersResult.modifiedCount} orders`);
    
    // Migration 4: Create inventory records for products without them
    console.log('🏪 Creating missing inventory records...');
    const products = await db.collection('products').find({}).toArray();
    let inventoryCreated = 0;
    
    for (const product of products) {
      const existingInventory = await db.collection('inventory').findOne({ 
        productId: product._id 
      });
      
      if (!existingInventory) {
        await db.collection('inventory').insertOne({
          productId: product._id,
          quantity: product.stock || 0,
          reserved: 0,
          lowStockThreshold: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        inventoryCreated++;
      }
    }
    console.log(`✅ Created ${inventoryCreated} inventory records`);
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    throw error;
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

migrateDatabase().catch(console.error);
