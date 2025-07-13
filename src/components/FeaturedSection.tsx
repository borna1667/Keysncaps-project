import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid from './ProductGrid';
import { getFeaturedProducts } from '../data/products';
import { Product } from '../types';

const FeaturedSection: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  useEffect(() => {
    getFeaturedProducts()
      .then(products => {
        // Ensure products is always an array
        const productsArray = Array.isArray(products) ? products : [];
        setFeaturedProducts(productsArray);
      })
      .catch(error => {
        console.error('Error loading featured products:', error);
        setFeaturedProducts([]);
      });
  }, []);
  
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-transparent">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-dark">Featured Products</h2>
          <Link to="/products" className="mt-3 md:mt-0 inline-flex items-center text-primary hover:text-accent transition-colors text-sm sm:text-base">
            View All Products <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
        
        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};

export default FeaturedSection;