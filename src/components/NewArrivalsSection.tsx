import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid from './ProductGrid';
import { getNewArrivals } from '../data/products';
import { Product } from '../types';

const NewArrivalsSection: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  useEffect(() => {
    getNewArrivals()
      .then(products => {
        // Ensure products is always an array
        const productsArray = Array.isArray(products) ? products : [];
        setNewArrivals(productsArray);
      })
      .catch(error => {
        console.error('Error loading new arrivals:', error);
        setNewArrivals([]);
      });
  }, []);
  
  return (
    <section className="py-16 bg-transparent">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-semibold text-dark">New Arrivals</h2>
          <Link to="/new-arrivals" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-accent transition-colors">
            View All New Arrivals <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <ProductGrid products={newArrivals} />
      </div>
    </section>
  );
};

export default NewArrivalsSection;