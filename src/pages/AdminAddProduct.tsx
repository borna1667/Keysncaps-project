import React, { useState, useEffect } from 'react';
import { Category, Product } from '../types';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PlusCircle, SlidersHorizontal, Trash2, Plus, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { productApi } from '../services/api';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';

// Common product filter options extracted from existing products
const keyboardSizes = ['40%', '50%', '60%', '65%', '75%', 'TKL', 'Full-size', 'Split', 'Compact', 'Other'];
const standards = ['ANSI', 'ISO', 'JIS'];
const connectivities = ['Wired', 'Wireless', 'Both', 'bluetooth',];
const keycapMaterials = ['PBT', 'ABS', 'POM', 'PC', 'PETG', 'Zinc', 'Aluminum', 'Brass', 'Wood', 'Resin', 'Silicone', 'Ceramic', 'Artisan'];
const colors = [
  'Black', 'White', 'Gray', 'Silver', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Gold', 'Bronze', 'Copper', 'Teal', 'Navy', 'Ivory', 'Beige', 'Brown', 'Transparent', 'Rainbow', 'Custom', 'Other'
];

// Add switchTypes array matching existing filter options
const switchTypes = [
  'Cherry MX Red', 'Cherry MX Blue', 'Cherry MX Brown', 'Cherry MX Black', 'Cherry MX Silent Red',
  'Gateron Red', 'Gateron Blue', 'Gateron Brown', 'Gateron Black', 'Gateron Yellow',
  'Kailh Box Red', 'Kailh Box Blue', 'Kailh Box Brown', 'Kailh Box White',
  'Optical', 'Topre', 'Alps', 'Romer-G', 'HyperX', 'SteelSeries QX2',
  'Logitech GL', 'Razer Green', 'Razer Yellow', 'Razer Orange', 'Holy Pandas', 'Other'
];

// Define spec options broken out by product type
const specOptionsByType: Record<Category, Record<string, string[]>> = {
  Keyboard: {
    'Layout': keyboardSizes,
    'Standard': standards,
    'Switch Type': switchTypes,
    'Connectivity': connectivities,
    'Keycap Material': keycapMaterials,
  },
  Switches: {
    'Brand': ['Cherry', 'Gateron', 'Kailh', 'KTT', 'Other'],
    'Type': ['Linear', 'Tactile', 'Clicky', 'Silent', 'Other'],
    'Actuation Force': ['35g', '45g', '55g', '65g', '75g', 'Other'],
    'Spring Weight': ['35g', '45g', '55g', '65g', '75g', 'Other'],
  },
  Keycaps: {
    'Material': keycapMaterials,
    'Profile': ['Cherry', 'OEM', 'SA', 'MT3', 'DSA', 'XDA', 'Other'],
    'Compatibility': ['MX', 'Topre', 'Alps', 'Other'],
    'Legends': ['ANSI', 'ISO', 'Nordic', 'Other'],
    'Keycap Count': ['61', '87', '104', '126', '140', 'Other'],
    'Thickness': ['1.2mm', '1.5mm', '1.8mm', '2.0mm', 'Other'],
  },
  Barebones: {
    'Layout': keyboardSizes,
    'Case Material': ['Aluminum', 'Plastic', 'Wood', 'Acrylic', 'Other'],
    'PCB Type': ['Hotswap', 'Solder', 'Other'],
    'Plate Material': ['Brass', 'Aluminum', 'PC', 'FR4', 'Polycarbonate', 'Other'],
  },
  Accessories: {
    'Keycap Material': keycapMaterials,
    'Profile': ['Cherry', 'OEM', 'SA', 'Other'],
    'Compatibility': ['MX', 'Other'],
  },
  Wireless: {
    'Connectivity': connectivities,
    'Battery Life': ['Up to 24h', 'Up to 48h', 'Up to 72h', 'Up to 1 week', 'Up to 2 weeks', 'Other'],
    'Layout': keyboardSizes,
    'Switch Type': switchTypes,
  },
  Gaming: {
    'Polling Rate': ['125Hz', '250Hz', '500Hz', '1000Hz', 'Other'],
    'Backlight': ['RGB', 'Single Color', 'None'],
    'Programmable Keys': ['Yes', 'No'],
    'Layout': keyboardSizes,
    'Switch Type': switchTypes,
  },
  Compact: {
    'Layout': ['40%', '50%', '60%', '65%', 'Other'],
    'Switch Type': switchTypes,
    'Connectivity': connectivities,
    'Programmable': ['Yes', 'No'],
  }
};

const defaultProduct: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  images: [''],
  category: 'Keyboard',
  description: '',
  specifications: {},
  inStock: true,
  featured: false,
  newArrival: false,
};

const categories: Category[] = [
  'Keyboard',
  'Wireless',
  'Gaming', 
  'Compact',
  'Accessories',
  'Switches',
  'Keycaps',
  'Barebones',
];

const AdminAddProduct: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [submittedPassword, setSubmittedPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setIsAuthed(true);
    }
  }, []);

  // Force logout function to reset auth state
  const handleLogout = () => {
    setIsAuthed(false);
    setEmail('');
    setPassword('');
    setSubmittedPassword(false);
    setLoginError('');
    localStorage.removeItem('adminToken');
  };

  const [product, setProduct] = useState(defaultProduct);
  // Dynamically choose specOptions for the current product type
  const availableSpecs = specOptionsByType[product.category] || {};
  const [specKey, setSpecKey] = useState<string>('');
  const [specValue, setSpecValue] = useState<string>('');
  
  // Tab management
  const [activeTab, setActiveTab] = useState('addProduct'); // 'addProduct', 'manageFilters'
  // Manage filter states
  const [newSize, setNewSize] = useState('');
  const [newStandard, setNewStandard] = useState('');
  const [newConnectivity, setNewConnectivity] = useState('');
  const [newKeycapMaterial, setNewKeycapMaterial] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newSwitchType, setNewSwitchType] = useState('');

  const [currentKeyboardSizes, setCurrentKeyboardSizes] = useState(keyboardSizes);
  const [currentStandards, setCurrentStandards] = useState(standards);
  const [currentConnectivities, setCurrentConnectivities] = useState(connectivities);
  const [currentKeycapMaterials, setCurrentKeycapMaterials] = useState(keycapMaterials);
  const [currentSwitchTypes, setCurrentSwitchTypes] = useState(switchTypes);
  const [currentColors, setCurrentColors] = useState(colors);
  const { addNotification } = useNotifications();

  // Function to validate current token
  const validateToken = async () => {
    // Always get the most current token from localStorage to avoid stale state
    const currentToken = localStorage.getItem('adminToken');
    if (!currentToken) return false;
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/auth/validate`,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
          withCredentials: true
        }
      );
      return response.data.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
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

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <span className="text-3xl md:text-4xl font-bold text-primary tracking-wider">KEYS 'N' CAPS</span>
            <p className="text-dark text-xs md:text-sm mt-1">Admin Panel</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'images') {
      setProduct({ ...product, images: value.split(',').map(s => s.trim()) });
    } else if (name === 'inStock' || name === 'featured' || name === 'newArrival') {
      setProduct({ ...product, [name]: checked });
    } else if (name === 'price') {
      setProduct({ ...product, price: parseFloat(value) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleAddSpec = () => {
    if (specKey && specValue) {
      setProduct({ ...product, specifications: { ...product.specifications, [specKey]: specValue } });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...product.specifications };
    delete newSpecs[key];
    setProduct({ ...product, specifications: newSpecs });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    try {
      // Validate required fields
      if (!product.name.trim() || !product.price || !product.description.trim()) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fill in all required fields (Name, Price, Description)'
        });
        setSubmitStatus('error');
        return;
      }

      // Check if token is still valid before submitting
      console.log('Validating token before product creation...');
      const isTokenValid = await validateToken();
      
      if (!isTokenValid) {
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'Your session has expired. Please log in again.'
        });
        setSubmitStatus('error');
        handleLogout();
        return;
      }
      console.log('✅ Token is valid, proceeding with product creation');

      // Get the current token from localStorage to ensure we use the most recent one
      const currentToken = localStorage.getItem('adminToken');
      if (!currentToken) {
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'No valid token found. Please log in again.'
        });
        setSubmitStatus('error');
        handleLogout();
        return;
      }

      // Prepare product data for API
      const productData = {
        name: product.name.trim(),
        price: Number(product.price),
        description: product.description.trim(),
        category: product.category.toLowerCase(),
        images: product.images.filter(img => img.trim() !== ''),
        specifications: product.specifications,
        featured: product.featured,
        newArrival: product.newArrival,
        stock: product.inStock ? 10 : 0,
        isActive: true,
        sku: `${product.category.toUpperCase()}-${product.name.replace(/\s+/g, '-').slice(0, 15)}-${Date.now().toString().slice(-6)}`.replace(/[^A-Z0-9-]/g, ''),
      };

      console.log('Creating product with data:', productData);
      console.log('Using token:', currentToken.substring(0, 20) + '...');

      // Create product using the API service
      const response = await productApi.createProduct(productData, currentToken);

      if (response && response.success) {
        console.log('Product created successfully:', response.product);
        
        // Create a properly formatted product for frontend
        const frontendProduct: Product = {
          id: response.product._id || response.product.id,
          name: response.product.name,
          price: response.product.price,
          images: response.product.images || ['https://via.placeholder.com/600x400?text=No+Image+Available'],
          category: response.product.category,
          description: response.product.description,
          specifications: response.product.specifications || {},
          inStock: (response.product.stock || 0) > 0,
          featured: Boolean(response.product.featured),
          newArrival: Boolean(response.product.newArrival),
        };

        // Also save to localStorage for immediate frontend visibility
        const stored = localStorage.getItem('newProducts') || '[]';
        const existing = JSON.parse(stored);
        existing.push(frontendProduct);
        localStorage.setItem('newProducts', JSON.stringify(existing));
        
        setSubmitStatus('success');
        addNotification({
          type: 'success',
          title: 'Product Created!',
          message: `"${product.name}" has been successfully added to the database and will appear in the store.`,
          duration: 8000
        });
        
        // Reset form
        setProduct(defaultProduct);
        setSpecKey('');
        setSpecValue('');
        
        // Navigate to products page after a short delay
        setTimeout(() => {
          navigate('/products', { replace: true });
        }, 1500);
      } else {
        throw new Error('Failed to create product - invalid response');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      setSubmitStatus('error');
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        addNotification({
          type: 'error',
          title: 'Authentication Failed',
          message: 'Your session has expired. Please log in again.',
          duration: 10000
        });
        handleLogout();
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      addNotification({
        type: 'error',
        title: 'Product Creation Failed',
        message: `Failed to add product to database: ${errorMessage}`,
        duration: 10000
      });
    }
  };
  
  const handleRemoveFilterValue = (valueToRemove: string, filterType: string) => {
    alert(`Attempting to remove "${valueToRemove}" from ${filterType}. (Backend logic needed here)`);
    // In a real app, you would update the state and call a backend API.
    // For example:
    // switch (filterType) {
    //   case 'keyboardSizes': setCurrentKeyboardSizes(prev => prev.filter(v => v !== valueToRemove)); break;
    //   case 'standards': setCurrentStandards(prev => prev.filter(v => v !== valueToRemove)); break;
    //   // ... and so on for other filter types
    // }
  };

  const addNewFilterValue = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, filterType?: string) => {
    if (value.trim()) {
      alert(`New filter value "${value}" added for ${filterType}! (In a real app, this would be saved to database and list updated)`);
      setter('');
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-background text-dark">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="min-h-screen container mx-auto px-3 md:px-4 py-6 md:py-12">
          <div className="w-full max-w-5xl mx-auto bg-light rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-4 md:p-6 lg:p-10 border border-secondary">
            {/* Add Logout Button */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-dark tracking-tight">Admin Panel</h1>
              <button
                onClick={handleLogout}
                className="bg-error text-light px-4 py-2 rounded-md font-medium hover:bg-error/90 transition text-sm"
              >
                Logout
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-secondary mb-6 md:mb-8">
              <button
                onClick={() => setActiveTab('addProduct')}
                className={`py-2 md:py-3 px-3 md:px-6 font-medium text-xs md:text-base focus:outline-none transition-colors duration-150
                  ${activeTab === 'addProduct'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <PlusCircle className="inline-block mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Add New Product</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={() => setActiveTab('manageFilters')}
                className={`py-2 md:py-3 px-3 md:px-6 font-medium text-xs md:text-base focus:outline-none transition-colors duration-150
                  ${activeTab === 'manageFilters'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <SlidersHorizontal className="inline-block mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Manage Filters</span>
                <span className="sm:hidden">Filters</span>
              </button>
            </div>
            
            {/* Add Product Tab */}
            {activeTab === 'addProduct' && (
              <section>
                <h1 className="text-3xl font-bold text-dark mb-10 tracking-tight">Add New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Product Information Section */}
                  <div className="p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                    <h2 className="text-xl font-semibold text-dark mb-4 md:mb-6">Product Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">Product Name</label>
                        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary placeholder-gray-400" required />
                      </div>
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-dark mb-1">Price</label>
                        <input type="number" name="price" id="price" value={product.price} onChange={handleChange} className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary placeholder-gray-400" required />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-dark mb-1">Description</label>
                        <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={4} className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary placeholder-gray-400" required />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="images" className="block text-sm font-medium text-dark mb-1">Image URLs (comma-separated)</label>
                        <input type="text" name="images" id="images" value={product.images.join(', ')} onChange={handleChange} className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary placeholder-gray-400" />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-dark mb-1">Category</label>
                        <select name="category" id="category" value={product.category} onChange={handleChange} className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary">
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-2 md:pt-4">
                        <div className="flex items-center">
                          <input type="checkbox" name="inStock" id="inStock" checked={product.inStock} onChange={handleChange} className="h-5 w-5 text-primary focus:ring-primary border-accent rounded" />
                          <label htmlFor="inStock" className="ml-2 text-sm text-dark">In Stock</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" name="featured" id="featured" checked={product.featured} onChange={handleChange} className="h-5 w-5 text-primary focus:ring-primary border-accent rounded" />
                          <label htmlFor="featured" className="ml-2 text-sm text-dark">Featured</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" name="newArrival" id="newArrival" checked={product.newArrival} onChange={handleChange} className="h-5 w-5 text-primary focus:ring-primary border-accent rounded" />
                          <label htmlFor="newArrival" className="ml-2 text-sm text-dark">New Arrival</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specifications Section */}
                  <div className="p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                    <h2 className="text-xl font-semibold text-dark mb-4 md:mb-6">Specifications</h2>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between bg-light p-2 md:p-3 rounded-md mb-2 md:mb-3 shadow-sm border border-accent">
                        <div className="overflow-hidden">
                          <span className="font-medium text-dark">{key}:</span>
                          <span className="text-gray-700 ml-2 break-words">{value}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveSpec(key)} className="text-error hover:text-error/80 transition-colors flex-shrink-0 ml-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-end">
                      <div>
                        <label htmlFor="specKey" className="block text-sm font-medium text-dark mb-1">Specification Name</label>
                        <input
                          type="text"
                          id="specKey"
                          list="specSuggestions"
                          value={specKey}
                          onChange={(e) => setSpecKey(e.target.value)}
                          className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary placeholder-gray-400"
                          placeholder="e.g., Layout, Switch Type"
                        />
                        <datalist id="specSuggestions">
                          {Object.keys(availableSpecs).map(key => (
                            <option key={key} value={key} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label htmlFor="specValue" className="block text-sm font-medium text-dark mb-1">Specification Value</label>
                        <input
                          type="text"
                          id="specValue"
                          list={specKey && availableSpecs[specKey] ? `specValueSuggestions-${specKey}` : undefined}
                          value={specValue}
                          onChange={(e) => setSpecValue(e.target.value)}
                          className="w-full bg-light border border-accent rounded-md p-2 md:p-3 text-dark focus:ring-primary focus:border-primary placeholder-gray-400"
                          placeholder="e.g., 75%, Cherry MX Red"
                        />
                        {specKey && availableSpecs[specKey] && (
                          <datalist id={`specValueSuggestions-${specKey}`}>
                            {availableSpecs[specKey].map(option => (
                              <option key={option} value={option} />
                            ))}
                          </datalist>
                        )}
                      </div>
                      <button type="button" onClick={handleAddSpec} className="bg-accent text-light px-4 md:px-6 py-2 md:py-3 rounded-md font-medium hover:bg-accent/90 transition h-fit flex items-center justify-center">
                        <Plus className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> Add Spec
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 md:pt-6">
                    <button 
                      type="submit" 
                      disabled={submitStatus === 'loading'}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition flex items-center ${
                        submitStatus === 'loading' 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : submitStatus === 'success'
                          ? 'bg-green-600 text-white'
                          : submitStatus === 'error'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-primary text-light hover:bg-primary/90'
                      }`}
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <CheckCircle className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                          Saved Successfully!
                        </>
                      ) : submitStatus === 'error' ? (
                        <>
                          <AlertCircle className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                          Try Again
                        </>
                      ) : (
                        <>
                          <Save className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                          Save Product
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            )}
            
            {/* Manage Filters Tab */}
            {activeTab === 'manageFilters' && (
            <section>
                <h1 className="text-3xl font-bold text-dark mb-6 md:mb-10 tracking-tight">Manage Product Filters</h1>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Here you can view and manage the available filter options for various product attributes. In a full application, you would add functionality to persist these changes to a database.</p>

                {/* Keyboard Sizes */}
                <div className="mb-6 md:mb-8 p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                    <h2 className="text-lg md:text-xl font-semibold text-dark mb-3 md:mb-4">Keyboard Sizes</h2>
                    <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                        {currentKeyboardSizes.map(size => (
                            <div key={size} className="bg-light border border-accent text-dark px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                                {size}
                                <button onClick={() => handleRemoveFilterValue(size, 'keyboardSizes')} className="ml-1 md:ml-2 text-error hover:text-error/80 transition-colors"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="Add new size" className="bg-light border border-accent rounded-md p-1 md:p-2 text-dark focus:ring-primary focus:border-primary text-xs md:text-sm flex-grow"/>
                        <button onClick={() => addNewFilterValue(newSize, setNewSize, 'Keyboard Size')} className="bg-accent text-light px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent/90 transition whitespace-nowrap flex items-center">
                            <Plus size={16} className="mr-1"/> Add
                        </button>
                    </div>
                </div>

                {/* Filter section container - using grid for better responsive layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Standards */}
                    <div className="p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                        <h2 className="text-lg md:text-xl font-semibold text-dark mb-3 md:mb-4">Standards</h2>
                        <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                            {currentStandards.map(standard => (
                                <div key={standard} className="bg-light border border-accent text-dark px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                                    {standard}
                                    <button onClick={() => handleRemoveFilterValue(standard, 'standards')} className="ml-1 md:ml-2 text-error hover:text-error/80 transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type="text" value={newStandard} onChange={(e) => setNewStandard(e.target.value)} placeholder="Add new standard" className="bg-light border border-accent rounded-md p-1 md:p-2 text-dark focus:ring-primary focus:border-primary text-xs md:text-sm flex-grow"/>
                            <button onClick={() => addNewFilterValue(newStandard, setNewStandard, 'Standard')} className="bg-accent text-light px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent/90 transition whitespace-nowrap flex items-center">
                                <Plus size={16} className="mr-1"/> Add
                            </button>
                        </div>
                    </div>
                    
                    {/* Connectivity */}
                    <div className="p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                        <h2 className="text-lg md:text-xl font-semibold text-dark mb-3 md:mb-4">Connectivity</h2>
                        <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                            {currentConnectivities.map(conn => (
                                <div key={conn} className="bg-light border border-accent text-dark px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                                    {conn}
                                    <button onClick={() => handleRemoveFilterValue(conn, 'connectivities')} className="ml-1 md:ml-2 text-error hover:text-error/80 transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type="text" value={newConnectivity} onChange={(e) => setNewConnectivity(e.target.value)} placeholder="Add new connectivity" className="bg-light border border-accent rounded-md p-1 md:p-2 text-dark focus:ring-primary focus:border-primary text-xs md:text-sm flex-grow"/>
                            <button onClick={() => addNewFilterValue(newConnectivity, setNewConnectivity, 'Connectivity')} className="bg-accent text-light px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent/90 transition whitespace-nowrap flex items-center">
                                <Plus size={16} className="mr-1"/> Add
                            </button>
                        </div>
                    </div>

                    {/* Keycap Materials */}
                    <div className="p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                        <h2 className="text-lg md:text-xl font-semibold text-dark mb-3 md:mb-4">Keycap Materials</h2>
                        <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                            {currentKeycapMaterials.map(mat => (
                                <div key={mat} className="bg-light border border-accent text-dark px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                                    {mat}
                                    <button onClick={() => handleRemoveFilterValue(mat, 'keycapMaterials')} className="ml-1 md:ml-2 text-error hover:text-error/80 transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type="text" value={newKeycapMaterial} onChange={(e) => setNewKeycapMaterial(e.target.value)} placeholder="Add new material" className="bg-light border border-accent rounded-md p-1 md:p-2 text-dark focus:ring-primary focus:border-primary text-xs md:text-sm flex-grow"/>
                            <button onClick={() => addNewFilterValue(newKeycapMaterial, setNewKeycapMaterial, 'Keycap Material', (val) => setCurrentKeycapMaterials(prev => [...prev, val]))} className="bg-accent text-light px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent/90 transition whitespace-nowrap flex items-center">
                                <Plus size={16} className="mr-1"/> Add
                            </button>
                        </div>
                    </div>

                    {/* Switch Types */}
                    <div className="p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                        <h2 className="text-lg md:text-xl font-semibold text-dark mb-3 md:mb-4">Switch Types</h2>
                        <div className="flex flex-wrap gap-2 mb-3 md:mb-4 max-h-32 md:max-h-40 overflow-y-auto">
                            {currentSwitchTypes.map(st => (
                                <div key={st} className="bg-light border border-accent text-dark px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                                    {st}
                                    <button onClick={() => handleRemoveFilterValue(st, 'switchTypes')} className="ml-1 md:ml-2 text-error hover:text-error/80 transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type="text" value={newSwitchType} onChange={(e) => setNewSwitchType(e.target.value)} placeholder="Add new switch type" className="bg-light border border-accent rounded-md p-1 md:p-2 text-dark focus:ring-primary focus:border-primary text-xs md:text-sm flex-grow"/>
                            <button onClick={() => addNewFilterValue(newSwitchType, setNewSwitchType, 'Switch Type', (val) => setCurrentSwitchTypes(prev => [...prev, val]))} className="bg-accent text-light px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent/90 transition whitespace-nowrap flex items-center">
                                <Plus size={16} className="mr-1"/> Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="mt-4 md:mt-6 p-4 md:p-6 bg-secondary/30 rounded-lg shadow-md border border-accent">
                    <h2 className="text-lg md:text-xl font-semibold text-dark mb-3 md:mb-4">Colors</h2>
                    <div className="flex flex-wrap gap-2 mb-3 md:mb-4 max-h-32 md:max-h-40 overflow-y-auto">
                        {currentColors.map(color => (
                            <div key={color} className="bg-light border border-accent text-dark px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                                <span className="w-3 h-3 inline-block rounded-full mr-1" style={{
                                    backgroundColor: color.toLowerCase(),
                                    border: color.toLowerCase() === 'white' || color.toLowerCase() === 'transparent' ? '1px solid #ccc' : 'none'
                                }}></span>
                                {color}
                                <button onClick={() => handleRemoveFilterValue(color, 'colors')} className="ml-1 md:ml-2 text-error hover:text-error/80 transition-colors"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <input type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Add new color" className="bg-light border border-accent rounded-md p-1 md:p-2 text-dark focus:ring-primary focus:border-primary text-xs md:text-sm flex-grow"/>
                        <button onClick={() => addNewFilterValue(newColor, setNewColor, 'Color', (val) => setCurrentColors(prev => [...prev, val]))} className="bg-accent text-light px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-accent/90 transition whitespace-nowrap flex items-center">
                            <Plus size={16} className="mr-1"/> Add
                        </button>
                    </div>
                </div>
            </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAddProduct;
