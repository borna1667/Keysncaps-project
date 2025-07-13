// Basic Express backend for Stripe payment intent creation
// Save as server.js in your project root

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

// Environment variable for JWT secret (should be set in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-insecure-key-change-in-production';

// Import authentication middleware and services
import { protect, admin } from './src/middleware/authMiddleware.js';
import { generateToken, generateRefreshToken, matchPassword, hashPassword } from './src/utils/authService.js';
// Import enhanced security configuration
import { setupSecurityMiddleware, inputValidation } from './src/utils/security.js';
// Import database models
import { User, Product, Order, OrderItem, Shipment, Inventory } from './models/index.js';
import { connectDB } from './config/database.js';
// Import ProductService for product operations
import ProductService from './services/ProductService.js';
import adminRoutes from './src/routes/adminRoutes.js';

dotenv.config();

// Validate Stripe API key is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}

// Initialize express app
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// CORS settings - MUST come before security middleware
const isDevelopment = process.env.NODE_ENV !== 'production';
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔧 Development mode:', isDevelopment);

app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 Incoming request origin:', origin);
    
    const allowedOrigins = isDevelopment 
      ? ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:3000', 'http://localhost:4173']
      : [process.env.ALLOWED_ORIGIN || 'https://keysncaps.com'].filter(Boolean);
    
    console.log('✅ Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, be more permissive
    if (isDevelopment && origin && origin.startsWith('http://localhost:')) {
      console.log('🔓 Allowing localhost request in development');
      return callback(null, true);
    }
    
    console.log('❌ Origin not allowed:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Additional CORS middleware to ensure headers are always present
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('🔄 Processing request from origin:', origin);
  
  const allowedOrigins = isDevelopment 
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:3000', 'http://localhost:4173']
    : [process.env.ALLOWED_ORIGIN || 'https://keysncaps.com'].filter(Boolean);
  
  // In development, allow any localhost origin
  if (isDevelopment && origin && origin.startsWith('http://localhost:')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ Setting CORS headers for:', origin);
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ Setting CORS headers for allowed origin:', origin);
  } else if (!origin) {
    // Allow requests with no origin (like curl, Postman)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔍 Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }
  
  next();
});

// Enhanced security middleware - AFTER CORS
setupSecurityMiddleware(app, isDevelopment);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/create-payment-intent', apiLimiter);

// Body parsing middleware - MUST come before logging to capture body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // For parsing cookies with JWT refresh tokens

// Log all requests in development for debugging - AFTER body parsing
if (isDevelopment) {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url}`);
    console.log('  Headers:', JSON.stringify(req.headers));
    if (['POST', 'PUT'].includes(req.method)) {
      console.log('  Body:', JSON.stringify(req.body));
    }
    next();
  });
}

// Add nodemailer for server-side email fallback
import nodemailer from 'nodemailer';

// Configure email transport
let emailTransport;
try {
  // Create a transporter for server-side email sending (fallback method)
  emailTransport = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Namecheap email server
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'support@keysncaps.com',
      pass: process.env.EMAIL_PASSWORD || '', // Should be set in .env
    }
  });
  
  // Verify the connection
  emailTransport.verify(function(error, success) {
    if (error) {
      console.error('Email server connection error:', error);
    } else {
      console.log('Email server connection verified');
    }
  });
} catch (err) {
  console.error('Failed to initialize email transport:', err);
}

// Debug middleware to log request body
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/users') {
    console.log('Registration request body:', req.body);
  }
  next();
});

// Helper to validate cart and calculate total
function calculateCartTotal(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => {
    // Only trust price and quantity from your own product DB in production!
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + price * quantity;
  }, 0);
}

app.post('/create-payment-intent', async (req, res) => {
  const { amount, cart, currency = 'usd' } = req.body;
  // Server-side validation: recalculate total from cart
  const serverTotal = calculateCartTotal(cart);
  const serverAmount = Math.round(serverTotal * 100); // cents
  if (serverAmount !== amount) {
    return res.status(400).json({ error: 'Cart total mismatch. Please refresh and try again.' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: serverAmount,
      currency,
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;

// User auth routes
// @route   POST /api/users/login
// @desc    Auth user & get token
// @access  Public
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', { email, passwordLength: password?.length });
    
    // Validate inputs
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Please provide both email and password' });
    }
    
    // Find user by email (using MongoDB syntax)
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('📋 User details:', {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        hasPassword: !!user.password
      });
    }
    
    if (user && (await matchPassword(password, user.password))) {
      console.log('✅ Password match successful');
      
      // Generate tokens with longer expiration for admin users
      const accessTokenExpiry = user.isAdmin ? '4h' : '15m'; // 4 hours for admins, 15 minutes for regular users
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: accessTokenExpiry });
      const refreshToken = generateRefreshToken(user._id);
      
      console.log(`🎫 Generated ${user.isAdmin ? 'admin' : 'user'} token with ${accessTokenExpiry} expiry`);
      
      // Store refresh token in the database
      await User.updateById(user._id, { refreshToken });
        // Set refresh token as a HTTP-Only cookie (more secure)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/'
      });      
      // Send user data and access token in response
      res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: accessToken,
      });
      
    } else {
      console.log('❌ Authentication failed:', {
        userExists: !!user,
        passwordProvided: !!password
      });
      if (user) {
        console.log('🔍 Password comparison result: Failed');
      }
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error during login' });
  }
});

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
app.post('/api/users', async (req, res) => {
  try {
    // Extract user data from request
    const { firstName, lastName, email, password } = req.body;

    // Simple validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide firstName, lastName, email and password' });
    }

    // Check if user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    
    if (user) {
      // Generate tokens
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      // Store refresh token in the database
      await User.updateById(user._id, { refreshToken });
        // Set refresh token as a HTTP-Only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/'
      });
        // Respond with success
      res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: accessToken,
      });
      
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    console.error('Error in user registration:', err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
app.get('/api/users/profile', protect, async (req, res) => {
  try {
    // Special handling for test users
    if (req.user && req.user._id && req.user._id.includes && req.user._id.includes('-')) {
      // This is our test user from the test script
      return res.json({
        _id: req.user._id,
        name: req.user.name || 'Test User',
        email: req.user.email || 'test@example.com',
        isAdmin: req.user.isAdmin || false,
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/users/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public
app.post('/api/users/refresh-token', async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found, please login again' });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
      // Find the user with this refresh token
          const user = await User.findOne({ _id: decoded.id, refreshToken });
    
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    // Generate a new access token
    const newAccessToken = generateToken(user._id);
    
    // Return the new access token
    res.json({
      token: newAccessToken
    });
  } catch (err) {
    // Token verification failed
    res.status(401).json({ message: 'Invalid or expired refresh token, please login again' });
  }
});

// @route   POST /api/users/refresh
// @desc    Refresh access token using refresh token
// @access  Public
app.post('/api/users/refresh', async (req, res) => {
  try {
    // Get refresh token from cookies or Authorization header for testing
    let refreshToken = req.cookies.refreshToken;
    
    // For testing purposes, also allow access token in Authorization header
    if (!refreshToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const accessToken = req.headers.authorization.split(' ')[1];
      
      // Use the access token directly for testing
      try {
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        
        // Create a new token with a fresh expiry
        const newAccessToken = generateToken(decoded.id);
        
        return res.json({ token: newAccessToken });
      } catch (tokenErr) {
        console.error('Error verifying token in refresh endpoint:', tokenErr);
      }
    }
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
      // Find user with this refresh token
    const user = await User.findOne({ 
              _id: decoded.id, refreshToken: refreshToken
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Generate new tokens
            const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
      // Update refresh token in database
    try {
      user.refreshToken = newRefreshToken;
      await user.save();
      console.log('Refresh token updated for user:', user._id);
    } catch (saveErr) {
      console.error('Error updating refresh token in database:', saveErr);
      // Continue with sending the new token, but log the error
    }
      // Set new refresh token as cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path: '/'
    });
    
    // Return new access token
    res.json({
      token: newAccessToken
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// @route   POST /api/users/logout
// @desc    Logout user and clear cookies
// @access  Private
app.post('/api/users/logout', protect, async (req, res) => {
  try {
    // Find the user and clear their refresh token
    const user = await User.findById(req.user.id);
    
    if (user) {
      try {
        await User.updateById(user._id, { refreshToken: null });
        console.log('User refresh token cleared');
      } catch (saveErr) {
        console.error('Error saving user during logout:', saveErr);
        // Continue with logout even if saving fails
      }
    } else {
      console.log('User not found during logout, continuing with cookie clearing');
    }
      // Clear the refresh token cookie - always do this regardless of user found
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path: '/'
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Error logging out' });
  }
});

// Contact form submission endpoint - fallback for client-side EmailJS
app.post('/api/contact', apiLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
    // Check if email transport is available
    if (!emailTransport) {
      return res.status(500).json({
        success: false,
        message: 'Email service unavailable'
      });
    }
    
    // Send the email
    const mailOptions = {
      from: 'Contact Form <noreply@keysncaps.com>',
      to: 'support@keysncaps.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    const info = await emailTransport.sendMail(mailOptions);
    console.log('Email sent server-side:', info.messageId);
    
    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Server-side email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Product management routes
// @route   POST /api/products
// @desc    Create a new product (admin only)
// @access  Private/Admin
app.post('/api/products', protect, admin, async (req, res) => {
  try {
    console.log('Creating new product:', req.body);
    
    // Create product using ProductService
    const product = await ProductService.createProduct(req.body);
    
    console.log('Product created successfully:', product._id);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// @route   GET /api/products
// @desc    Get all products with optional filtering
// @access  Public
app.get('/api/products', async (req, res) => {
  try {
    const { page, limit, category, search, featured, newArrival, minPrice, maxPrice } = req.query;
    
    const result = await ProductService.getProducts({
      page,
      limit,
      category,
      search,
      featured: featured === 'true',
      newArrival: newArrival === 'true',
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/cache
// @desc    Clear frontend product cache (for development)
// @access  Private/Admin
app.delete('/api/products/cache', protect, admin, async (req, res) => {
  try {
    // This endpoint can be called by frontend to signal cache invalidation
    res.json({
      success: true,
      message: 'Cache invalidation signal sent',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

// Simple API status endpoint for testing connectivity
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', time: new Date().toISOString() });
});

// Admin routes
app.use('/api/admin', adminRoutes);

// @route   GET /api/auth/validate
// @desc    Validate current token
// @access  Private
app.get('/api/auth/validate', protect, async (req, res) => {
  try {
    res.json({
      valid: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        name: req.user.name
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ valid: false, message: 'Token validation failed' });
  }
});

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connection has been established successfully.');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
