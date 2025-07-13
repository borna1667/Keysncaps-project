import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  // Get the first available image or use placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/400x400?text=No+Image';
  
  return (
    <motion.div
      className="bg-transparent backdrop-blur-md border border-accent/10 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-primary/30"
      whileHover={{ y: -5 }}
      style={{
        minHeight: '300px', // Ensure minimum height
      }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-dark/20">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={imageError ? 'https://via.placeholder.com/400x400?text=No+Image' : imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-primary text-background px-2 py-1 text-xs font-semibold rounded">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-dark">{product.name}</h3>
          <p className="text-dark/70 text-sm mt-1 line-clamp-2">{product.description}</p>
          
          {/* Price and stock status */}
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
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-400/30">
                  In Stock
                </span>
              ) : (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-400/30">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          
          {/* View Details button */}
          <button 
            className="w-full mt-4 bg-primary/30 text-primary hover:bg-primary hover:text-background transition-colors rounded-md py-2 font-medium border border-primary/50"
          >
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;