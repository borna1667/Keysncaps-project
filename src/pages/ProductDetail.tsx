import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus, Check, Star, Share2, Zap, Shield, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Get safe images array - ensure it's always an array with at least one item
  const productImages = React.useMemo(() => {
    if (!product) return ['https://via.placeholder.com/600x400?text=No+Image+Available'];
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      return ['https://via.placeholder.com/600x400?text=No+Image+Available'];
    }
    return product.images;
  }, [product]);

  // Load product asynchronously
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData || null);
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-kloud-dark via-background to-kloud-dark">
        {/* Animated Background Effects */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #BFF205 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #D7F205 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, #83A603 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #BFF205 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="container-custom relative z-10">
          <motion.div 
            className="py-24 text-center bg-light/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-20 h-20 mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-2 border-accent/50 animate-ping"></div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading Product...
            </motion.h2>
            
            <motion.p
              className="text-dark/70 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Preparing something amazing for you
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-kloud-dark via-background to-kloud-dark">
        {/* Animated Background Effects */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, #BFF205 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #D7F205 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, #83A603 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, #BFF205 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="container-custom relative z-10">
          <motion.div 
            className="bg-light/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/20 p-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="text-4xl">🔍</div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Product Not Found
            </motion.h1>
            
            <motion.p 
              className="text-xl text-dark/70 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The product you're looking for doesn't exist or has been removed from our collection.
            </motion.p>
            
            <motion.button 
              onClick={() => navigate('/products')}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary via-accent to-secondary text-background font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Products
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareUrl = `https://keysncaps.com/product/${product.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareSuccess(true);
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % productImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + productImages.length) % productImages.length);
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-kloud-dark via-background to-kloud-dark">
      {/* Animated Background Effects */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #BFF205 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, #D7F205 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, #83A603 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #BFF205 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              y: -100,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="container-custom relative z-10 px-4 md:px-6 pt-32 pb-24">
        {/* Back Button */}
        <motion.button 
          onClick={() => navigate(-1)}
          className="group inline-flex items-center text-primary hover:text-accent transition-all duration-300 mb-8 p-2 rounded-full hover:bg-primary/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </motion.button>
        
        {/* Main Product Card */}
        <motion.div 
          className="bg-light/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/20 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <motion.div 
              className="relative p-8 lg:p-12"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Image Container with Glow Effect */}
                <div className="relative group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-2xl blur-xl"
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [0.95, 1.05, 0.95] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div 
                    className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary/10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={productImages[currentImageIndex]}
                        alt={product?.name || 'Product image'}
                        className="w-full h-auto max-h-96 object-contain rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Image Navigation */}
                {productImages.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary/20 backdrop-blur-sm rounded-full p-3 text-dark hover:bg-primary hover:text-background transition-all duration-300 shadow-lg"
                      onClick={prevImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <ChevronLeft size={20} />
                    </motion.button>
                    
                    <motion.button
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary/20 backdrop-blur-sm rounded-full p-3 text-dark hover:bg-primary hover:text-background transition-all duration-300 shadow-lg"
                      onClick={nextImage}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <ChevronRight size={20} />
                    </motion.button>

                    {/* Image Indicators */}
                    <div className="flex justify-center mt-6 space-x-2">
                      {productImages.map((_, index) => (
                        <motion.button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'bg-primary shadow-lg' 
                              : 'bg-primary/30 hover:bg-primary/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
            
            {/* Product Info Section */}
            <motion.div 
              className="p-8 lg:p-12 space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Product Header */}
              <div className="space-y-4">
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {product?.category || 'Category'}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-dark/70 ml-2">(4.8)</span>
                  </div>
                </motion.div>

                <motion.h1 
                  className="text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {product?.name || 'Product Name'}
                </motion.h1>
                
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-4xl font-bold text-primary">
                    ${product?.price?.toFixed(2) || '0.00'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product?.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product?.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={shareSuccess ? 'Link copied!' : 'Share this product'}
                >
                  {shareSuccess ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                </motion.button>
              </motion.div>

              {/* Description */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-2xl font-heading font-semibold text-dark">Description</h3>
                <p className="text-dark/80 leading-relaxed text-lg">
                  {product?.description || 'No description available'}
                </p>
              </motion.div>
              
              {/* Specifications */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <h3 className="text-2xl font-heading font-semibold text-dark">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product?.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                    <motion.div 
                      key={key} 
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-primary/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <div className="text-sm text-primary font-medium mb-1">{key}</div>
                      <div className="text-dark font-semibold">{value}</div>
                    </motion.div>
                  ))}
                  {(!product?.specifications || Object.keys(product.specifications).length === 0) && (
                    <motion.div 
                      className="col-span-2 text-dark/60 text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      No specifications available
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Purchase Section */}
              <motion.div
                className="space-y-6 pt-6 border-t border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-medium text-dark">Quantity:</span>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full border border-primary/20">
                      <motion.button 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 text-primary hover:bg-primary hover:text-background disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="h-4 w-4" />
                      </motion.button>
                      <span className="px-6 py-3 text-lg font-semibold text-dark min-w-[4rem] text-center">
                        {quantity}
                      </span>
                      <motion.button 
                        onClick={() => handleQuantityChange(1)}
                        className="p-3 text-primary hover:bg-primary hover:text-background transition-all duration-300 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <motion.button 
                  onClick={handleAddToCart}
                  disabled={!product?.inStock || addedToCart}
                  className={`
                    group relative w-full py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden
                    ${addedToCart 
                      ? 'bg-green-500 text-white shadow-green-500/50' 
                      : product?.inStock 
                        ? 'bg-gradient-to-r from-primary via-accent to-secondary text-background shadow-primary/50 hover:shadow-2xl' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                  whileHover={product?.inStock && !addedToCart ? { scale: 1.05 } : {}}
                  whileTap={product?.inStock && !addedToCart ? { scale: 0.95 } : {}}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {addedToCart ? (
                      <>
                        <Check className="h-6 w-6 mr-3" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-6 w-6 mr-3" />
                        {product?.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </span>
                  
                  {product?.inStock && !addedToCart && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.button>

                {/* Trust Indicators */}
                <motion.div
                  className="flex items-center justify-center space-x-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="flex items-center space-x-2 text-sm text-dark/70">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-dark/70">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-dark/70">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Fast Delivery</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;