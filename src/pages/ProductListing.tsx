import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { 
  SlidersHorizontal, Search, ChevronDown, ChevronUp, 
  ArrowUpDown, Check, X, Keyboard, Wifi, Package, Gamepad2, 
  MinusSquare, ChevronsUpDown, RotateCcw 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import KeyboardKeyFilter from '../components/KeyboardKeyFilter';
import SearchBar from '../components/SearchBar';
import { Category, Product } from '../types';
import { getAllProducts, getProductsByCategory, searchProducts } from '../data/products';

// 3D Background Element
function FloatingOrb() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere args={[1.5, 16, 16]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#BFF205"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          opacity={0.2}
          transparent={true}
        />
      </Sphere>
    </Float>
  );
}

// Filter types
type PriceRange = { min: number; max: number };
type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high';
type FilterState = {
  category: Category | 'All';
  priceRange: PriceRange;
  inStock: boolean;
  specifications: Record<string, string[]>;
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

// Default price range
const defaultPriceRange: PriceRange = { min: 0, max: 500 };

const ProductListing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('featured');
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecFilters, setActiveSpecFilters] = useState<Record<string, string[]>>({});
  const [loadingAnimation, setLoadingAnimation] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: defaultPriceRange,
    inStock: false,
    specifications: {},
  });

  // Get category from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      // Set the category filter from URL
      setFilters(prev => ({
        ...prev,
        category: categoryParam as Category
      }));
    }

    // Remove the artificial loading delay - products should show immediately when loaded
    setLoadingAnimation(false);
    setFiltersVisible(true);
  }, [location.search]);

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setLoadingAnimation(true); // Show loading animation only during actual loading
        let data: Product[];
        
        if (filters.category !== 'All') {
          data = await getProductsByCategory(filters.category.toLowerCase());
        } else {
          data = await getAllProducts();
        }
        
        setProducts(data);
        setIsLoading(false);
        setLoadingAnimation(false); // Hide loading animation when products are loaded
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
        setLoadingAnimation(false);
      }
    };
    
    loadProducts();
  }, [filters.category]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // Reset to filtered products when search is cleared
      applyFilters(filters, products, currentSort);
      return;
    }
    
    try {
      setIsLoading(true);
      const searchResults = await searchProducts(query);
      
      // Apply current filters to search results
      applyFilters(filters, searchResults, currentSort);
      setIsLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Apply filters to products
  const applyFilters = (
    filters: FilterState,
    productsToFilter: Product[],
    sortOption: SortOption
  ) => {
    let result = [...productsToFilter];
    
    // Apply category filter if not 'All'
    if (filters.category !== 'All') {
      result = result.filter(
        product => product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= filters.priceRange.min && 
                 product.price <= filters.priceRange.max
    );
    
    // Apply in-stock filter if enabled
    if (filters.inStock) {
      result = result.filter(product => product.inStock);
    }
    
    // Apply specification filters
    Object.entries(filters.specifications).forEach(([specName, values]) => {
      if (values.length > 0) {
        result = result.filter(product => {
          const productValue = product.specifications[specName];
          return productValue && values.includes(productValue);
        });
      }
    });
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // Assuming newer products have higher IDs or we'd use a date field
        result = [...result].sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        // Featured items first, then regular items
        result = [...result].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
    
    setFilteredProducts(result);
  };

  // Update filtered products when filters, products, or sort changes
  useEffect(() => {
    applyFilters(filters, products, currentSort);
  }, [filters, products, currentSort]);

  // Handle category filter change
  const handleCategoryChange = (category: Category | 'All') => {
    setFilters(prev => ({ ...prev, category }));
    
    // Update URL query parameter
    const params = new URLSearchParams(location.search);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    navigate({ search: params.toString() });
  };

  // Handle price range change
  const handlePriceChange = (range: PriceRange) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  // Handle in-stock filter toggle
  const handleInStockToggle = () => {
    setFilters(prev => ({ ...prev, inStock: !prev.inStock }));
  };

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setCurrentSort(option);
    setSortMenuOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'All',
      priceRange: defaultPriceRange,
      inStock: false,
      specifications: {},
    });
    setCurrentSort('featured');
    setSearchQuery('');
    
    // Clear URL parameters
    navigate({ search: '' });
  };

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract all available specifications from products
  const availableSpecifications = React.useMemo(() => {
    const specs: Record<string, Set<string>> = {};
    
    products.forEach(product => {
      Object.entries(product.specifications).forEach(([key, value]) => {
        if (!specs[key]) specs[key] = new Set();
        specs[key].add(value);
      });
    });
    
    // Convert Sets to arrays
    return Object.fromEntries(
      Object.entries(specs).map(([key, valueSet]) => [
        key, 
        Array.from(valueSet).sort()
      ])
    );
  }, [products]);

  // Handle specification filter change
  const toggleSpecificationValue = (specName: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev.specifications[specName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        specifications: {
          ...prev.specifications,
          [specName]: newValues
        }
      };
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 1 }, // Changed from 0 to 1 to ensure visibility
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 1 }, // Changed from 0 to 1 to ensure visibility
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-kloud-dark to-light relative">
      <Navbar />
      
      {/* 3D Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[60vh] opacity-50 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#BFF205" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D7F205" />
          <FloatingOrb />
        </Canvas>
      </div>
      
      <main className="flex-grow pt-32 pb-24 relative z-10">
        <div className="container-custom px-4 md:px-6">
          {/* Header Section with animated title */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4">
              <motion.span
                className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Shop
              </motion.span>{' '}
              <span className="text-dark">Collection</span>
            </h1>
            <motion.p 
              className="text-lg text-dark/70 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Discover our premium selection of mechanical keyboards, keycaps, and accessories.
            </motion.p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile filter toggle */}
            <motion.div 
              className="lg:hidden flex justify-between items-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="flex items-center px-4 py-2 bg-light/80 backdrop-blur-md border border-accent/20 rounded-lg shadow-sm hover:bg-light transition-colors text-dark"
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
                {isMobileFilterOpen ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                  className="flex items-center px-4 py-2 bg-light/80 backdrop-blur-md border border-accent/20 rounded-lg shadow-sm hover:bg-light transition-colors text-dark"
                >
                  <ArrowUpDown size={18} className="mr-2" />
                  Sort
                  {sortMenuOpen ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
                </button>
                
                {/* Sort dropdown */}
                <AnimatePresence>
                  {sortMenuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-56 bg-light border border-accent/20 rounded-lg shadow-lg z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="py-2">
                        {sortOptions.map(option => (
                          <li key={option.value}>
                            <button 
                              className={`flex items-center w-full px-4 py-2 text-left hover:bg-accent/10 ${currentSort === option.value ? 'text-primary font-medium' : 'text-dark'}`}
                              onClick={() => handleSortChange(option.value)}
                            >
                              {currentSort === option.value && <Check size={16} className="mr-2" />}
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Mobile filters panel */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <motion.div 
                  className="lg:hidden bg-light/95 backdrop-blur-md border border-accent/20 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-dark">Filters</h3>
                    <button 
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="text-dark/70 hover:text-dark"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Mobile filter content */}
                  <div className="space-y-6">
                    {/* Category filter section */}
                    <div>
                      <h4 className="font-medium text-dark mb-3">Categories</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <KeyboardKeyFilter
                          category="All"
                          isSelected={filters.category === 'All'}
                          onClick={() => handleCategoryChange('All')}
                        />
                        <KeyboardKeyFilter
                          category="Keyboard"
                          isSelected={filters.category === 'Keyboard'}
                          onClick={() => handleCategoryChange('Keyboard')}
                        />
                        <KeyboardKeyFilter
                          category="Wireless"
                          isSelected={filters.category === 'Wireless'}
                          onClick={() => handleCategoryChange('Wireless')}
                        />
                        <KeyboardKeyFilter
                          category="Gaming"
                          isSelected={filters.category === 'Gaming'}
                          onClick={() => handleCategoryChange('Gaming')}
                        />
                        <KeyboardKeyFilter
                          category="Compact"
                          isSelected={filters.category === 'Compact'}
                          onClick={() => handleCategoryChange('Compact')}
                        />
                        <KeyboardKeyFilter
                          category="Accessories"
                          isSelected={filters.category === 'Accessories'}
                          onClick={() => handleCategoryChange('Accessories')}
                        />
                      </div>
                    </div>
                    
                    {/* Price range filter */}
                    <div>
                      <h4 className="font-medium text-dark mb-3">Price Range</h4>
                      <div className="flex items-center space-x-4">
                        <div className="w-1/2">
                          <label className="text-sm text-dark/70 mb-1 block">Min</label>
                          <input
                            type="number"
                            min="0"
                            max={filters.priceRange.max}
                            value={filters.priceRange.min}
                            onChange={(e) => handlePriceChange({...filters.priceRange, min: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 bg-light border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="text-sm text-dark/70 mb-1 block">Max</label>
                          <input
                            type="number"
                            min={filters.priceRange.min}
                            value={filters.priceRange.max}
                            onChange={(e) => handlePriceChange({...filters.priceRange, max: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 bg-light border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* In stock toggle */}
                    <div>
                      <button
                        onClick={handleInStockToggle}
                        className="flex items-center w-full"
                      >
                        <span className={`w-4 h-4 mr-2 flex-shrink-0 border rounded flex items-center justify-center ${filters.inStock ? 'bg-primary border-primary' : 'border-accent'}`}>
                          {filters.inStock && <Check size={12} className="text-white" />}
                        </span>
                        <span className="text-dark">In Stock Only</span>
                      </button>
                    </div>
                    
                    {/* Reset filters button */}
                    <div>
                      <button
                        onClick={resetFilters}
                        className="flex items-center px-4 py-2 bg-accent/10 hover:bg-accent/20 text-dark rounded-md transition-colors"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop sidebar filters */}
            <motion.div 
              className="hidden lg:block w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: filtersVisible ? 1 : 0, x: filtersVisible ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-light/80 backdrop-blur-md border border-accent/20 rounded-lg shadow-lg p-4 sticky top-32">
                <div className="space-y-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-dark text-lg mb-2">Filters</h3>
                    <SearchBar 
                      onSearch={handleSearch}
                      placeholder="Search products..." 
                      className="mb-4"
                    />
                  </div>
                  
                  {/* Category filter */}
                  <div>
                    <h4 className="font-medium text-dark mb-3">Categories</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCategoryChange('All')}
                        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                          filters.category === 'All' 
                            ? 'bg-primary text-white font-medium' 
                            : 'hover:bg-accent/10 text-dark'
                        }`}
                      >
                        <ChevronsUpDown size={16} className="mr-2" />
                        All Categories
                      </button>
                      
                      <button
                        onClick={() => handleCategoryChange('Keyboard')}
                        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                          filters.category === 'Keyboard' 
                            ? 'bg-primary text-white font-medium' 
                            : 'hover:bg-accent/10 text-dark'
                        }`}
                      >
                        <Keyboard size={16} className="mr-2" />
                        Keyboards
                      </button>
                      
                      <button
                        onClick={() => handleCategoryChange('Wireless')}
                        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                          filters.category === 'Wireless' 
                            ? 'bg-primary text-white font-medium' 
                            : 'hover:bg-accent/10 text-dark'
                        }`}
                      >
                        <Wifi size={16} className="mr-2" />
                        Wireless
                      </button>
                      
                      <button
                        onClick={() => handleCategoryChange('Gaming')}
                        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                          filters.category === 'Gaming' 
                            ? 'bg-primary text-white font-medium' 
                            : 'hover:bg-accent/10 text-dark'
                        }`}
                      >
                        <Gamepad2 size={16} className="mr-2" />
                        Gaming
                      </button>
                      
                      <button
                        onClick={() => handleCategoryChange('Compact')}
                        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                          filters.category === 'Compact' 
                            ? 'bg-primary text-white font-medium' 
                            : 'hover:bg-accent/10 text-dark'
                        }`}
                      >
                        <MinusSquare size={16} className="mr-2" />
                        Compact
                      </button>
                      
                      <button
                        onClick={() => handleCategoryChange('Accessories')}
                        className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                          filters.category === 'Accessories' 
                            ? 'bg-primary text-white font-medium' 
                            : 'hover:bg-accent/10 text-dark'
                        }`}
                      >
                        <Package size={16} className="mr-2" />
                        Accessories
                      </button>
                    </div>
                  </div>
                  
                  {/* Price range filter */}
                  <div>
                    <h4 className="font-medium text-dark mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-dark/70">
                        <span>${filters.priceRange.min}</span>
                        <span>${filters.priceRange.max}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={500}
                        step={10}
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceChange({...filters.priceRange, max: parseInt(e.target.value)})}
                        className="w-full accent-primary"
                      />
                      <div className="flex items-center space-x-4">
                        <div className="w-1/2">
                          <label className="text-xs text-dark/70 mb-1 block">Min</label>
                          <input
                            type="number"
                            min="0"
                            max={filters.priceRange.max}
                            value={filters.priceRange.min}
                            onChange={(e) => handlePriceChange({...filters.priceRange, min: parseInt(e.target.value) || 0})}
                            className="w-full px-2 py-1 text-sm bg-light border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="text-xs text-dark/70 mb-1 block">Max</label>
                          <input
                            type="number"
                            min={filters.priceRange.min}
                            value={filters.priceRange.max}
                            onChange={(e) => handlePriceChange({...filters.priceRange, max: parseInt(e.target.value) || 0})}
                            className="w-full px-2 py-1 text-sm bg-light border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* In stock toggle */}
                  <div>
                    <button
                      onClick={handleInStockToggle}
                      className="flex items-center w-full"
                    >
                      <span className={`w-5 h-5 mr-2 flex-shrink-0 border rounded flex items-center justify-center transition-colors ${filters.inStock ? 'bg-primary border-primary' : 'border-accent'}`}>
                        {filters.inStock && <Check size={14} className="text-white" />}
                      </span>
                      <span className="text-dark">In Stock Only</span>
                    </button>
                  </div>
                  
                  {/* Specification filters */}
                  {Object.entries(availableSpecifications).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-dark">Specifications</h4>
                      
                      {Object.entries(availableSpecifications).map(([specName, values]) => (
                        <div key={specName} className="space-y-2">
                          <h5 className="text-sm text-dark/70">{specName}</h5>
                          <div className="space-y-1">
                            {values.map(value => (
                              <button
                                key={value}
                                onClick={() => toggleSpecificationValue(specName, value)}
                                className="flex items-center w-full"
                              >
                                <span className={`w-4 h-4 mr-2 flex-shrink-0 border rounded flex items-center justify-center ${filters.specifications[specName]?.includes(value) ? 'bg-primary border-primary' : 'border-accent'}`}>
                                  {filters.specifications[specName]?.includes(value) && <Check size={12} className="text-white" />}
                                </span>
                                <span className="text-dark text-sm">{value}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Reset filters */}
                  <div>
                    <button
                      onClick={resetFilters}
                      className="flex items-center px-4 py-2 w-full bg-accent/10 hover:bg-accent/20 text-dark rounded-md transition-colors"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Area */}
            <motion.div 
              className="flex-grow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Desktop Search and Sort */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div className="w-64">
                  <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search products..." 
                  />
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                    className="flex items-center px-4 py-2 bg-light/80 backdrop-blur-md border border-accent/20 rounded-lg shadow-sm hover:bg-light transition-colors text-dark"
                  >
                    <ArrowUpDown size={18} className="mr-2" />
                    Sort: {sortOptions.find(opt => opt.value === currentSort)?.label}
                    {sortMenuOpen ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
                  </button>
                  
                  {/* Sort dropdown */}
                  <AnimatePresence>
                    {sortMenuOpen && (
                      <motion.div 
                        className="absolute right-0 mt-2 w-56 bg-light border border-accent/20 rounded-lg shadow-lg z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ul className="py-2">
                          {sortOptions.map(option => (
                            <li key={option.value}>
                              <button 
                                className={`flex items-center w-full px-4 py-2 text-left hover:bg-accent/10 ${currentSort === option.value ? 'text-primary font-medium' : 'text-dark'}`}
                                onClick={() => handleSortChange(option.value)}
                              >
                                {currentSort === option.value && <Check size={16} className="mr-2" />}
                                {option.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Loading animation */}
              <AnimatePresence>
                {(loadingAnimation || isLoading) && (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-dark/70 animate-pulse">Loading products...</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Products grid */}
              {!loadingAnimation && !isLoading && (
                <>
                  {/* Results info */}
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-dark/70">
                      Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </p>
                    
                    {/* Active filters display */}
                    {(filters.category !== 'All' || 
                       filters.inStock || 
                       filters.priceRange.min > 0 || 
                       filters.priceRange.max < 500 || 
                       Object.values(filters.specifications).some(values => values.length > 0) ||
                       searchQuery) && (
                      <div className="flex flex-wrap gap-2">
                        {filters.category !== 'All' && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md flex items-center"
                          >
                            {filters.category}
                            <button onClick={() => handleCategoryChange('All')} className="ml-1">
                              <X size={14} />
                            </button>
                          </motion.div>
                        )}
                        
                        {filters.inStock && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md flex items-center"
                          >
                            In Stock
                            <button onClick={handleInStockToggle} className="ml-1">
                              <X size={14} />
                            </button>
                          </motion.div>
                        )}
                        
                        {searchQuery && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md flex items-center"
                          >
                            "{searchQuery}"
                            <button onClick={() => handleSearch('')} className="ml-1">
                              <X size={14} />
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                      <p>{error}</p>
                      <button 
                        className="mt-2 underline"
                        onClick={() => window.location.reload()}
                      >
                        Retry
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <motion.div 
                      className="text-center py-20 bg-light/50 backdrop-blur-sm rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl font-semibold text-dark mb-2">No products found</h3>
                      <p className="text-dark/70 mb-6">Try adjusting your filters or search query.</p>
                      <button
                        onClick={resetFilters}
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <RotateCcw size={16} className="mr-2" />
                        Reset Filters
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      ref={containerRef}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          variants={itemVariants}
                          custom={index}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl z-0 animate-pulse-light" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl z-0 animate-pulse-light" />
    </div>
  );
};

export default ProductListing;