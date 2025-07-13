import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  PlusCircle, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [submittedPassword, setSubmittedPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [token, setToken] = useState<string>('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  });
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthed(true);
      loadDashboardStats();
    }
  }, []);

  // Force logout function to reset auth state
  const handleLogout = () => {
    setIsAuthed(false);
    setEmail('');
    setPassword('');
    setSubmittedPassword(false);
    setLoginError('');
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const handleAdminLogin = async () => {
    setSubmittedPassword(true);
    setLoginError('');
    try {
      console.log('🔐 Attempting login with:', { email });
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
      
      console.log('✅ Login response:', res.data);
      
      if (res.data && res.data.isAdmin && res.data.token) {
        setIsAuthed(true);
        setToken(res.data.token);
        localStorage.setItem('adminToken', res.data.token);
        console.log('✅ Admin authenticated successfully');
        // Load dashboard stats after successful login
        loadDashboardStats();
      } else if (res.data && !res.data.isAdmin) {
        setLoginError('Not an admin account.');
        console.log('❌ User is not admin');
      } else {
        setLoginError('Invalid response from server.');
        console.log('❌ Invalid server response:', res.data);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setLoginError('Invalid credentials.');
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        setStats({
          totalProducts: response.data.totalProducts || 0,
          totalOrders: response.data.totalOrders || 0,
          totalUsers: response.data.totalUsers || 0,
          revenue: response.data.revenue || 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <span className="text-3xl md:text-4xl font-bold text-primary tracking-wider">KEYS 'N' CAPS</span>
            <p className="text-dark text-xs md:text-sm mt-1">Admin Dashboard</p>
          </div>
          <div className="bg-light p-6 md:p-8 rounded-lg md:rounded-xl shadow-xl md:shadow-2xl border border-secondary">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-dark">Admin Login</h2>
            <input
              type="email"
              className="w-full bg-light border border-secondary rounded-md p-2.5 md:p-3 mb-4 text-dark text-sm md:text-base focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-gray-500"
              placeholder="Admin email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              className="w-full bg-light border border-secondary rounded-md p-2.5 md:p-3 mb-4 text-dark text-sm md:text-base focus:ring-2 focus:ring-primary focus:border-primary transition placeholder-gray-500"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyPress={e => { if (e.key === 'Enter') handleAdminLogin(); }}
            />
            <button
              className="w-full bg-primary text-light py-2.5 md:py-3 rounded-md text-sm md:text-base font-semibold hover:bg-primary/80 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-light"
              onClick={handleAdminLogin}
            >
              Login
            </button>
            {loginError && (
              <div className="text-error mt-3 md:mt-4 text-xs md:text-sm text-center">{loginError}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-dark">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="min-h-screen container mx-auto px-3 md:px-4 py-6 md:py-12">
          <div className="w-full max-w-7xl mx-auto bg-light rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-4 md:p-6 lg:p-10 border border-secondary">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark tracking-tight">Admin Dashboard</h1>
                <p className="text-secondary text-sm md:text-base mt-1">Manage your Keys'n'Caps store</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-error text-light px-4 py-2 rounded-md font-medium hover:bg-error/90 transition text-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 md:p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 md:p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Revenue</p>
                    <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              
              {/* Add Products */}
              <div 
                onClick={() => navigate('/admin/add-product')}
                className="bg-secondary/30 hover:bg-secondary/50 border border-accent rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-light p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark ml-4">Add Products</h3>
                </div>
                <p className="text-secondary text-sm">Add new products to your inventory and manage specifications.</p>
              </div>

              {/* View Orders */}
              <div 
                onClick={() => navigate('/admin/orders')}
                className="bg-secondary/30 hover:bg-secondary/50 border border-accent rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-600 text-light p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark ml-4">Manage Orders</h3>
                </div>
                <p className="text-secondary text-sm">View and manage customer orders and shipments.</p>
              </div>

              {/* View Products */}
              <div 
                onClick={() => navigate('/products')}
                className="bg-secondary/30 hover:bg-secondary/50 border border-accent rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-light p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark ml-4">View Store</h3>
                </div>
                <p className="text-secondary text-sm">View your store as customers see it.</p>
              </div>

              {/* Analytics (Future) */}
              <div className="bg-secondary/30 border border-accent rounded-lg p-6 opacity-50">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-400 text-light p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark ml-4">Analytics</h3>
                </div>
                <p className="text-secondary text-sm">View sales analytics and reports. (Coming Soon)</p>
              </div>

              {/* User Management (Future) */}
              <div className="bg-secondary/30 border border-accent rounded-lg p-6 opacity-50">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-400 text-light p-3 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark ml-4">User Management</h3>
                </div>
                <p className="text-secondary text-sm">Manage customer accounts and permissions. (Coming Soon)</p>
              </div>

              {/* Settings (Future) */}
              <div className="bg-secondary/30 border border-accent rounded-lg p-6 opacity-50">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-400 text-light p-3 rounded-lg">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark ml-4">Settings</h3>
                </div>
                <p className="text-secondary text-sm">Configure store settings and preferences. (Coming Soon)</p>
              </div>

            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
              <h3 className="text-lg font-semibold text-dark mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => navigate('/admin/add-product')}
                  className="bg-primary text-light px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition text-sm flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  Add Product
                </button>
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="bg-green-600 text-light px-4 py-2 rounded-md font-medium hover:bg-green-700 transition text-sm flex items-center gap-2"
                >
                  <Package size={16} />
                  View Orders
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 text-light px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition text-sm flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Store
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
