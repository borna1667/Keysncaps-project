// Test script to verify product creation functionality
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:4242';

async function testProductCreation() {
  try {
    console.log('🧪 Testing product creation flow...');
    
    // First, login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/users/login`, {
      email: 'admin@keysncaps.com',
      password: 'admin'
    }, { withCredentials: true });
    
    if (!loginResponse.data.isAdmin || !loginResponse.data.token) {
      throw new Error('Failed to login as admin');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Create a test product
    console.log('2. Creating test product...');
    const testProduct = {
      name: 'Test Keyboard ' + Date.now(),
      price: 99.99,
      description: 'A test keyboard created via automated script',
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
    
    const createResponse = await axios.post(`${API_BASE_URL}/api/products`, testProduct, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (!createResponse.data.success) {
      throw new Error('Product creation failed');
    }
    
    console.log('✅ Product created successfully:', createResponse.data.product._id);
    
    // Verify the product can be retrieved
    console.log('3. Verifying product retrieval...');
    const getResponse = await axios.get(`${API_BASE_URL}/api/products`);
    
    const products = getResponse.data.products || getResponse.data;
    const createdProduct = products.find(p => p._id === createResponse.data.product._id);
    
    if (!createdProduct) {
      throw new Error('Created product not found in product list');
    }
    
    console.log('✅ Product verification successful');
    console.log('🎉 All tests passed! Product creation is working correctly.');
    
    return {
      success: true,
      productId: createResponse.data.product._id,
      productName: createdProduct.name
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use in other files
export { testProductCreation };

// Run test if this file is executed directly
if (typeof window === 'undefined' && process.argv[1] === new URL(import.meta.url).pathname) {
  testProductCreation().then(result => {
    console.log('Test result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
