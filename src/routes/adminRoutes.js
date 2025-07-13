// Admin routes for administrative functions
import express from 'express';
import jwt from 'jsonwebtoken';
import { protect, admin } from '../middleware/authMiddleware.js';
import { User, Product, Order } from '../../models/index.js';

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(admin);

// @route   POST /api/admin/login
// @desc    Admin login (alternative endpoint)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, isAdmin: true });
    
    if (user && (await user.validatePassword(password, user.password))) {
      // Generate token (you'd typically use the auth service here)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      Product.count({ isActive: true }),
      Order.count(),
      User.count()
    ]);

    // Calculate total revenue from completed orders
    const completedOrders = await Order.find({ 
      status: 'delivered',
      paymentStatus: 'paid' 
    });
    
    const revenue = completedOrders.reduce((sum, order) => {
      return sum + (order.totalAmount || order.total || 0);
    }, 0);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      revenue: revenue.toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin management
// @access  Private/Admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}, { sort: { createdAt: -1 } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin management
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}, { sort: { createdAt: -1 } });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const updateData = { status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    
    const order = await Order.updateById(req.params.id, updateData);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// @route   POST /api/admin/orders/notification
// @desc    Send notification about order status change
// @access  Private/Admin
router.post('/orders/notification', async (req, res) => {
  try {
    const { orderId, userId, status } = req.body;
    
    // In a real app, you'd send push notifications, emails, etc.
    console.log(`Notification sent for order ${orderId} to user ${userId}: Status changed to ${status}`);
    
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// @route   POST /api/admin/orders/email-notification
// @desc    Send email notification about order status change
// @access  Private/Admin
router.post('/orders/email-notification', async (req, res) => {
  try {
    const { orderId, userId, status, userEmail } = req.body;
    
    // In a real app, you'd send emails using nodemailer or similar
    console.log(`Email notification sent for order ${orderId} to ${userEmail}: Status changed to ${status}`);
    
    res.json({ success: true, message: 'Email notification sent' });
  } catch (error) {
    console.error('Error sending email notification:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin management
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { 
      sort: { createdAt: -1 },
      select: '-password' // Don't send passwords
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router;
