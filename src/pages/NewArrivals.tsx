import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getAllProducts } from '../data/products';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowDownAZ, ArrowDownZA, ArrowDown01, ArrowDown10 } from 'lucide-react';

const NewArrivals: React.FC = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load products asynchronously
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        // Ensure products is always an array
        const productsArray = Array.isArray(products) ? products : [];
        setAllProducts(productsArray);
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Get new arrivals from loaded products - ensure allProducts is an array
  const allNewArrivals = Array.isArray(allProducts) ? allProducts.filter(p => p.newArrival) : [];
  
  // Add sorting state
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Sort new arrivals based on selected option
  const sortProducts = () => {
    let sorted = [...allNewArrivals];
    
    switch (sortOption) {
      case 'nameAsc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default sorting (keep original order)
        break;
    }
    
    return sorted;
  };
  
  const newArrivals = sortProducts();

  return (
    <div className="relative pt-32 pb-24 bg-gradient-to-br from-background via-kloud-dark to-light min-h-screen overflow-hidden">
      <div className="container-custom relative z-10 rounded-3xl bg-light/90 shadow-2xl border-4 border-primary/10 p-6 md:p-12 mb-10 animate-fade-in backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-6"
        >
          <span className="mr-2">&#8592;</span> Back
        </button>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-primary drop-shadow-lg text-center">New Arrivals</h1>
        <p className="text-center text-dark mb-8">{newArrivals.length} newly added products just for you</p>
        
        {/* Sorting Options */}
        {newArrivals.length > 0 && (
          <div className="flex flex-col md:flex-row justify-end items-center mb-8 gap-3">
            <span className="text-dark font-medium">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSortOption('nameAsc')} 
                className={`px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${sortOption === 'nameAsc' ? 'bg-primary text-background' : 'bg-light hover:bg-light/80 text-dark'}`}
              >
                <ArrowDownAZ className="w-4 h-4 mr-1" /> Name A-Z
              </button>
              <button 
                onClick={() => setSortOption('nameDesc')} 
                className={`px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${sortOption === 'nameDesc' ? 'bg-primary text-background' : 'bg-light hover:bg-light/80 text-dark'}`}
              >
                <ArrowDownZA className="w-4 h-4 mr-1" /> Name Z-A
              </button>
              <button 
                onClick={() => setSortOption('priceAsc')} 
                className={`px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${sortOption === 'priceAsc' ? 'bg-primary text-background' : 'bg-light hover:bg-light/80 text-dark'}`}
              >
                <ArrowDown01 className="w-4 h-4 mr-1" /> Price Low-High
              </button>
              <button 
                onClick={() => setSortOption('priceDesc')} 
                className={`px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${sortOption === 'priceDesc' ? 'bg-primary text-background' : 'bg-light hover:bg-light/80 text-dark'}`}
              >
                <ArrowDown10 className="w-4 h-4 mr-1" /> Price High-Low
              </button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="py-24 text-center bg-light bg-opacity-80 rounded-2xl shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-medium text-dark mb-4">
              Loading new arrivals...
            </h2>
          </div>
        ) : newArrivals.length > 0 ? (
          <ProductGrid products={newArrivals} />
        ) : (
          <div className="py-24 text-center bg-light bg-opacity-80 rounded-2xl shadow-md">
            <h2 className="text-2xl font-medium text-dark mb-4">
              No new arrivals at the moment
            </h2>
            <p className="text-dark/70">
              Check back soon for the latest products!
            </p>
          </div>
        )}
      </div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl z-0 animate-pulse-light" />
    </div>
  );
};

export default NewArrivals;
