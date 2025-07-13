// Shared constants for the application
import dotenv from 'dotenv';

dotenv.config();

// Environment variable for JWT secret (should be set in .env in production)
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-insecure-key-change-in-production';

console.log('🔑 JWT_SECRET loaded:', JWT_SECRET.substring(0, 10) + '...');
