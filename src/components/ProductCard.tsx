import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      className="bg-light/80 backdrop-blur-md border border-accent/20 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
      whileHover={{ y: -5 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-semibold rounded">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-dark">{product.name}</h3>
          <p className="text-dark/70 text-sm mt-1 line-clamp-2">{product.description}</p>
          
          {/* Price and stock status, removed like and visibility counts */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-dark">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-dark/50 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            {/* Only show stock status */}
            <div>
              {product.inStock ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          
          {/* Add to cart button */}
          <button 
            className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-md py-2 font-medium"
          >
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;