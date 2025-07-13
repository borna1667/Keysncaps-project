// Authentication middleware
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-insecure-key-change-in-production';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token.substring(0, 20) + '...');

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded successfully:', { id: decoded.id });

      // Get user from the token
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        console.error('User not found for token');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('User found:', { id: req.user._id, email: req.user.email, isAdmin: req.user.isAdmin });
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header or invalid format');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware - check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
