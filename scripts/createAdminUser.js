// Script to create an admin user in the Keys'n'Caps database
import dotenv from 'dotenv';
import { connectPostgreSQL, disconnectPostgreSQL } from '../config/postgresql.js';
import { User, initializeModels } from '../models/postgresql.js';

console.log('📦 Loading environment variables...');
dotenv.config();
console.log('✅ Environment loaded');

const createAdminUser = async () => {  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    await connectPostgreSQL();
    console.log('✅ Connected to PostgreSQL successfully!');

    console.log('🔧 Initializing database models...');
    await initializeModels();
    console.log('✅ Models initialized successfully!');

    // Check if admin user already exists
    const existingAdmin = await User.findByEmail('admin@keysncaps.com');
    
    if (existingAdmin) {
      console.log('⚠️  Admin user with email admin@keysncaps.com already exists!');
      console.log(`   User ID: ${existingAdmin.id}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Admin Status: ${existingAdmin.isAdmin ? 'Yes' : 'No'}`);
      return;
    }

    // Create new admin user
    console.log('🔨 Creating new admin user...');
    
    const adminData = {
      name: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@keysncaps.com',
      password: 'admin', // Will be hashed by the User.createUser method
      phone: '+1-555-0123',
      role: 'admin',
      isAdmin: true,
      isActive: true,
      isEmailVerified: true,
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        dashboard: {
          theme: 'dark',
          autoRefresh: true
        }
      },
      loyaltyPoints: 1000, // Give admin some initial loyalty points
      referralCode: 'ADMIN2025'
    };

    const newAdmin = await User.createUser(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('📋 Admin User Details:');
    console.log(`   ID: ${newAdmin.id}`);
    console.log(`   Name: ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role: ${newAdmin.role}`);
    console.log(`   Admin Status: ${newAdmin.isAdmin ? 'Yes' : 'No'}`);
    console.log(`   Active: ${newAdmin.isActive ? 'Yes' : 'No'}`);
    console.log(`   Email Verified: ${newAdmin.isEmailVerified ? 'Yes' : 'No'}`);
    console.log(`   Referral Code: ${newAdmin.referralCode}`);
    console.log(`   Created At: ${newAdmin.createdAt}`);

    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: admin@keysncaps.com`);
    console.log(`   Password: admin`);
    
    console.log('\n🎉 Admin user setup complete! You can now login to the admin dashboard.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.name === 'SequelizeValidationError') {
      console.error('📝 Validation errors:');
      error.errors.forEach(err => {
        console.error(`   - ${err.path}: ${err.message}`);
      });
    }
  } finally {
    try {
      await disconnectPostgreSQL();
      console.log('🔌 Disconnected from PostgreSQL');
    } catch (disconnectError) {
      console.error('⚠️  Error disconnecting from database:', disconnectError.message);
    }
  }
};

// Run the script
console.log('🔍 Checking execution condition...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

// Always run when executed directly
console.log('🚀 Starting admin user creation script...');
createAdminUser().catch(error => {
  console.error('💥 Script failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

export default createAdminUser;
