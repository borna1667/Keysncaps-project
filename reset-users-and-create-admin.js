// Script to remove all users and create a fresh admin user
import { connectDB, disconnectDB, getDB } from './config/database.js';
import { User } from './models/index.js';
import bcrypt from 'bcryptjs';

const resetUsersAndCreateAdmin = async () => {
  try {
    console.log('🔄 Starting user reset process...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    const db = getDB();
    const usersCollection = db.collection('users');
    
    // Remove all existing users
    console.log('🗑️  Removing all existing users...');
    const deleteResult = await usersCollection.deleteMany({});
    console.log(`✅ Removed ${deleteResult.deletedCount} users from database`);
    
    // Create new admin user
    console.log('🔨 Creating new admin user...');
    
    const adminData = {
      name: 'Admin User',
      email: 'admin@keysncaps.com',
      password: 'admin123',
      role: 'admin',
      isAdmin: true,
      isActive: true,
      isEmailVerified: true,
      phone: '+1-555-0123',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    // Hash the password
    const saltRounds = 12;
    adminData.password = await bcrypt.hash(adminData.password, saltRounds);
    
    // Insert the admin user
    const insertResult = await usersCollection.insertOne(adminData);
    
    if (insertResult.insertedId) {
      console.log('✅ New admin user created successfully!');
      console.log('📋 Admin Credentials:');
      console.log('   Email: admin@keysncaps.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
      console.log('   User ID:', insertResult.insertedId.toString());
      console.log('');
      console.log('🌐 Admin Dashboard URL: http://localhost:4242/admin');
      console.log('🔑 Login API Endpoint: http://localhost:4242/api/users/login');
    } else {
      throw new Error('Failed to create admin user');
    }
    
    // Verify the user was created correctly
    console.log('🔍 Verifying admin user...');
    const createdUser = await usersCollection.findOne({ email: 'admin@keysncaps.com' });
    
    if (createdUser && createdUser.isAdmin) {
      console.log('✅ Admin user verification successful!');
      console.log('   Admin privileges: Confirmed');
      console.log('   Email verified: ', createdUser.isEmailVerified);
      console.log('   Account active: ', createdUser.isActive);
    } else {
      console.log('❌ Admin user verification failed!');
    }
    
  } catch (error) {
    console.error('❌ Error during user reset:', error);
    throw error;
  } finally {
    console.log('🔌 Disconnecting from database...');
    await disconnectDB();
    console.log('✅ Disconnected successfully');
  }
};

// Run the script
console.log('🚀 Keys\'n\'Caps - User Reset and Admin Creation');
console.log('=' .repeat(50));

resetUsersAndCreateAdmin()
  .then(() => {
    console.log('🎉 User reset and admin creation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
