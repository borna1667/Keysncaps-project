// Test the actual login API endpoint
import axios from 'axios';

const testRealLogin = async () => {
  try {
    console.log('🔐 Testing real API login endpoint...');
    
    // Test with the correct password
    console.log('1. Testing with admin123...');
    try {
      const response1 = await axios.post(
        'http://localhost:4242/api/users/login',
        {
          email: 'admin@keysncaps.com',
          password: 'admin123'
        },
        { withCredentials: true }
      );
      
      console.log('✅ Login with admin123 successful!');
      console.log('   Response:', response1.data);
    } catch (error1) {
      console.log('❌ Login with admin123 failed:', error1.response?.data || error1.message);
    }
    
    // Test with the alternative password some scripts expect
    console.log('\n2. Testing with admin...');
    try {
      const response2 = await axios.post(
        'http://localhost:4242/api/users/login',
        {
          email: 'admin@keysncaps.com',
          password: 'admin'
        },
        { withCredentials: true }
      );
      
      console.log('✅ Login with admin successful!');
      console.log('   Response:', response2.data);
    } catch (error2) {
      console.log('❌ Login with admin failed:', error2.response?.data || error2.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

console.log('🧪 Testing Real Login API');
console.log('=' .repeat(40));

testRealLogin();
