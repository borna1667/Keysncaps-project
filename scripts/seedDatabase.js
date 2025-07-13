import { connectDB, disconnectDB } from '../config/database.js';
import { User, Product, Order, OrderItem, Shipment, Inventory } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Sample products data based on your existing products.ts
const sampleProducts = [
  {
    name: 'Nordic Pro 60%',
    price: 169.99,
    images: [
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'keyboard',
    description: 'Compact 60% mechanical keyboard with Nordic layout, Cherry MX Brown switches and PBT keycaps.',
    specifications: {
      'Switch Type': 'Cherry MX Brown',
      'Keycaps': 'PBT Double-shot',
      'Layout': 'ANSI (60%)',
      'Connectivity': 'USB-C Detachable',
      'Backlighting': 'RGB',
    },
    featured: true,
    newArrival: false,
    stock: 25,
    sku: 'KEYBOARD-NORDIC-PRO-60',
    isActive: true
  },
  {
    name: 'Cherry MX Blue Switches (Pack of 10)',
    price: 12.99,
    images: [
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'switches',
    description: 'Authentic Cherry MX Blue mechanical switches with tactile feedback and audible click.',
    specifications: {
      'Switch Type': 'Tactile',
      'Actuation Force': '50g',
      'Travel Distance': '4mm',
      'Mount Type': 'PCB Mount',
      'Durability': '50 million keystrokes'
    },
    featured: false,
    newArrival: true,
    stock: 100,
    sku: 'SWITCHES-CHERRY-MX-BLUE',
    isActive: true
  },
  {
    name: 'Artisan Dragon Keycap Set',
    price: 89.99,
    images: [
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'keycaps',
    description: 'Hand-crafted artisan keycap set with dragon theme, compatible with Cherry MX switches.',
    specifications: {
      'Material': 'Resin',
      'Profile': 'Cherry',
      'Compatibility': 'MX',
      'Count': '87 keys',
      'Legends': 'Laser Etched'
    },
    featured: true,
    newArrival: true,
    stock: 15,
    sku: 'KEYCAPS-ARTISAN-DRAGON',
    isActive: true
  },
  {
    name: 'TKL Aluminum Barebone Kit',
    price: 149.99,
    images: [
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'barebones',
    description: 'Premium TKL aluminum keyboard kit with hotswap PCB and brass plate.',
    specifications: {
      'Layout': 'TKL',
      'Case Material': 'Aluminum',
      'PCB Type': 'Hotswap',
      'Plate Material': 'Brass',
      'Connectivity': 'USB-C'
    },
    featured: false,
    newArrival: false,
    stock: 20,
    sku: 'BAREBONES-TKL-ALUMINUM',
    isActive: true
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@keysncaps.com',
  password: 'admin123', // Will be hashed
  role: 'admin',
  isAdmin: true,
  isActive: true
};

// Sample regular user
const regularUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'user123', // Will be hashed
  role: 'user',
  isAdmin: false,
  isActive: true
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.getCollection().deleteMany({});
    await Product.getCollection().deleteMany({});
    await Order.getCollection().deleteMany({});
    await OrderItem.getCollection().deleteMany({});
    await Shipment.getCollection().deleteMany({});
    await Inventory.getCollection().deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const createdAdmin = await User.createUser(adminUser);
    console.log(`✅ Admin user created: ${createdAdmin.email}`);
    
    // Create regular user
    console.log('👤 Creating regular user...');
    const createdUser = await User.createUser(regularUser);
    console.log(`✅ Regular user created: ${createdUser.email}`);
    
    // Create products
    console.log('📦 Creating products...');
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const product = await Product.createProduct(productData);
      createdProducts.push(product);
      
      // Create inventory record for each product
      await Inventory.createInventoryRecord({
        productId: product._id,
        quantity: productData.stock,
        reserved: 0,
        lowStockThreshold: 5
      });
      
      console.log(`✅ Product created: ${product.name}`);
    }
    
    // Create a sample order
    console.log('📄 Creating sample order...');
    const sampleOrder = await Order.createOrder({
      userId: createdUser._id,
      totalAmount: 182.98,
      currency: 'USD',
      paymentMethod: 'stripe',
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      billingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    // Create order items
    await OrderItem.createOrderItem({
      orderId: sampleOrder._id,
      productId: createdProducts[0]._id,
      quantity: 1,
      price: createdProducts[0].price,
      productName: createdProducts[0].name
    });
    
    await OrderItem.createOrderItem({
      orderId: sampleOrder._id,
      productId: createdProducts[1]._id,
      quantity: 1,
      price: createdProducts[1].price,
      productName: createdProducts[1].name
    });
    
    console.log(`✅ Sample order created: ${sampleOrder.orderNumber}`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${await User.count()}`);
    console.log(`📦 Products: ${await Product.count()}`);
    console.log(`📄 Orders: ${await Order.count()}`);
    console.log(`📦 Order Items: ${await OrderItem.count()}`);
    console.log(`🏪 Inventory Records: ${await Inventory.count()}`);
    
    console.log('\n🔑 Admin Login:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

seedDatabase().catch(console.error);
