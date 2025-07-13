import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ShoppingCart, Check, Copy, Facebook, Twitter, Mail } from 'lucide-react';
import { Product } from '../types';

// Define component props
interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Share functionality using keysncaps.com domain
  const handleShare = async (platform?: string) => {
    // Use keysncaps.com domain instead of localhost
    const productUrl = `https://keysncaps.com/product/${product.id}`;
    const shareText = `Check out this ${product.name} from Keys-N-Caps`;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=Check out this product from Keys-N-Caps&body=${encodeURIComponent(shareText + '\n\n' + productUrl)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(productUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    } else {
      // Native share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.name,
            text: shareText,
            url: productUrl,
          });
        } catch (err) {
          console.error('Share failed:', err);
        }
      } else {
        // Fallback to copy URL
        handleShare('copy');
      }
    }
    
    setShareMenuOpen(false);
  };

  // Increase quantity
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  
  // Decrease quantity but not below 1
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="product-detail">
      {/* Product images */}
      {/* ...existing code... */}

      {/* Product info */}
      <div className="product-info">
        <h1 className="text-3xl font-bold text-dark">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-dark/50 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Stock status */}
        <div className="mt-4">
          {product.inStock ? (
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              In Stock
            </span>
          ) : (
            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product description */}
        <p className="mt-4 text-dark/80">{product.description}</p>

        {/* Specifications */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-dark">Specifications</h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-dark/70">{key}:</span>
                <span className="text-dark font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-dark mb-2">Quantity</h3>
          <div className="flex items-center">
            <button 
              onClick={decreaseQuantity}
              className="px-3 py-1 border border-accent/20 rounded-l-md hover:bg-accent/10"
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
              min="1"
              className="w-16 text-center border-y border-accent/20 py-1 focus:outline-none"
            />
            <button 
              onClick={increaseQuantity}
              className="px-3 py-1 border border-accent/20 rounded-r-md hover:bg-accent/10"
            >
              +
            </button>
          </div>
        </div>

        {/* Action buttons - removed like button, keeping share button */}
        <div className="flex items-center gap-4 mt-6">
          <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
          
          {/* Share button with dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className="p-3 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
              aria-label="Share product"
            >
              <Share2 size={20} />
            </button>
            
            {/* Share dropdown */}
            <AnimatePresence>
              {shareMenuOpen && (
                <motion.div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-accent/20 rounded-lg shadow-lg z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-2">
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-accent/10 text-dark"
                    >
                      <Facebook size={16} className="mr-3" />
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-accent/10 text-dark"
                    >
                      <Twitter size={16} className="mr-3" />
                      Twitter
                    </button>
                    <button 
                      onClick={() => handleShare('email')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-accent/10 text-dark"
                    >
                      <Mail size={16} className="mr-3" />
                      Email
                    </button>
                    <button 
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-accent/10 text-dark"
                    >
                      {copySuccess ? <Check size={16} className="mr-3 text-green-600" /> : <Copy size={16} className="mr-3" />}
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;