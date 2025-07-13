// Test script to verify authentication and product creation
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:4242';

async function testAuthentication() {
  console.log('🧪 Testing authentication and product creation flow...\n');
  
  try {
    // Step 1: Login as admin
    console.log('1. 🔐 Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@keysncaps.com',
      password: 'admin'
    }, { withCredentials: true });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', JSON.stringify(loginResponse.data, null, 2));
    
    if (!loginResponse.data.isAdmin || !loginResponse.data.token) {
      throw new Error('❌ Failed to login as admin or get token');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('🎫 Token (first 20 chars):', token.substring(0, 20) + '...');
    console.log('👤 User ID:', loginResponse.data._id);
    console.log('📧 Email:', loginResponse.data.email);
    console.log('🔑 Is Admin:', loginResponse.data.isAdmin);
    
    // Step 2: Validate token
    console.log('\n2. 🔍 Validating token...');
    const validateResponse = await axios.get(`${API_BASE_URL}/api/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('Validation response:', JSON.stringify(validateResponse.data, null, 2));
    console.log('✅ Token validation successful');
    
    // Step 3: Create a test product
    console.log('\n3. 📦 Creating test product...');
    const testProduct = {
      name: 'Test Keyboard ' + Date.now(),
      price: 99.99,
      description: 'A test keyboard created via automated script for auth testing',
      category: 'keyboard',
      images: ['https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg'],
      specifications: {
        'Layout': '60%',
        'Switch Type': 'Cherry MX Blue',
        'Connectivity': 'Wired'
      },
      featured: false,
      newArrival: true,
      stock: 5,
      isActive: true,
      sku: `TEST-KEYBOARD-${Date.now()}`
    };
    
    console.log('Product data to send:', JSON.stringify(testProduct, null, 2));
    
    const createResponse = await axios.post(`${API_BASE_URL}/api/products`, testProduct, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('Product creation response status:', createResponse.status);
    console.log('Product creation response:', JSON.stringify(createResponse.data, null, 2));
    
    if (!createResponse.data.success) {
      throw new Error('❌ Product creation failed');
    }
    
    console.log('✅ Product created successfully:', createResponse.data.product._id);
    
    // Step 4: Verify the product can be retrieved
    console.log('\n4. 🔍 Verifying product retrieval...');
    const getResponse = await axios.get(`${API_BASE_URL}/api/products`);
    
    const products = getResponse.data.products || getResponse.data;
    const createdProduct = products.find(p => p._id === createResponse.data.product._id);
    
    if (!createdProduct) {
      throw new Error('❌ Created product not found in product list');
    }
    
    console.log('✅ Product verification successful');
    console.log('📦 Product found:', createdProduct.name);
    
    console.log('\n🎉 All tests passed! Authentication and product creation are working correctly.');
    
    return {
      success: true,
      productId: createResponse.data.product._id,
      productName: createdProduct.name,
      token: token.substring(0, 20) + '...'
    };
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📋 Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('🔗 Request URL:', error.config?.url);
      console.error('📨 Request headers:', JSON.stringify(error.config?.headers, null, 2));
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testAuthentication().then(result => {
  console.log('\n📊 Final test result:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('\n💥 Test script crashed:', error);
  process.exit(1);
});
