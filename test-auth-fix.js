#!/usr/bin/env node

/**
 * Test script to verify the authentication loop fix
 * This script simulates the authentication loop scenario
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:4242';

// Test credentials - update these to match your admin user
const TEST_ADMIN = {
  email: 'admin@keysncaps.com',
  password: 'admin123'
};

async function testAuthenticationLoop() {
  console.log('🧪 Testing Authentication Loop Fix');
  console.log('=====================================\n');

  try {
    // Step 1: Login and get token
    console.log('Step 1: Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, TEST_ADMIN);
    
    if (!loginResponse.data.isAdmin) {
      throw new Error('User is not an admin');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received:', token.substring(0, 20) + '...\n');

    // Step 2: Validate token immediately
    console.log('Step 2: Validating token immediately after login...');
    const validateResponse1 = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token validation 1:', validateResponse1.data.valid ? 'VALID' : 'INVALID\n');

    // Step 3: Wait a moment then validate again (simulates re-login scenario)
    console.log('Step 3: Waiting 2 seconds then validating again...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const validateResponse2 = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token validation 2:', validateResponse2.data.valid ? 'VALID' : 'INVALID\n');

    // Step 4: Try to create a product
    console.log('Step 4: Attempting to create a test product...');
    const testProduct = {
      name: `Test Product ${Date.now()}`,
      price: 99.99,
      description: 'This is a test product created by the auth fix test script',
      category: 'keyboard',
      images: ['https://via.placeholder.com/600x400?text=Test+Product'],
      specifications: { 'Test Spec': 'Test Value' },
      featured: false,
      newArrival: false,
      stock: 5,
      isActive: true,
      sku: `TEST-${Date.now()}`
    };

    const createResponse = await axios.post(`${API_BASE_URL}/api/products`, testProduct, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (createResponse.data.success) {
      console.log('✅ Product creation successful!');
      console.log('   Product ID:', createResponse.data.product._id || createResponse.data.product.id);
      console.log('   Product Name:', createResponse.data.product.name);
    } else {
      console.log('❌ Product creation failed:', createResponse.data);
    }

    console.log('\n🎉 Authentication Loop Test PASSED - No infinite loop detected!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 This looks like an authentication error. Possible causes:');
      console.log('   1. Server is not running');
      console.log('   2. Admin user does not exist');
      console.log('   3. Wrong credentials');
      console.log('   4. Token handling issue (the bug we\'re trying to fix)');
    }

    process.exit(1);
  }
}

// Run the test
testAuthenticationLoop();
