import { useEffect, useState } from 'react';
import ModernHero from '../components/ModernHero';
// import Enhanced3DSection from '../components/Enhanced3DSection';
import CategorySection from '../components/CategorySection';
// import InteractiveShowcase from '../components/InteractiveShowcase';
// import TestimonialsSection from '../components/TestimonialsSection';
// import TechSpecsSection from '../components/TechSpecsSection';
import FuturisticLoader from '../components/FuturisticLoader';
// import TestThreeJS from '../components/TestThreeJS';
// import SimpleThreeTest from '../components/SimpleThreeTest';
import { motion } from 'framer-motion';
import { /* getFeaturedProducts, */ getNewArrivals } from '../data/products';
import { Product } from '../types';

const Home: React.FC = () => {
  // const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduce loading time for debugging
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Much shorter for debugging

    // Load featured products
    // getFeaturedProducts()
    //   .then(products => {
    //     const productsArray = Array.isArray(products) ? products : [];
    //     setFeaturedProducts(productsArray);
    //   })
    //   .catch(error => {
    //     console.error('Error loading featured products:', error);
    //     setFeaturedProducts([]);
    //   });

    // Load new arrivals
    getNewArrivals()
      .then(products => {
        const productsArray = Array.isArray(products) ? products : [];
        setNewArrivals(productsArray);
      })
      .catch(error => {
        console.error('Error loading new arrivals:', error);
        setNewArrivals([]);
      });

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <>
      {/* Futuristic Loading Screen */}
      {isLoading && (
        <FuturisticLoader 
          isLoading={isLoading} 
          onComplete={() => setIsLoading(false)} 
        />
      )}
      
      {/* Main Content */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative overflow-hidden"
        >

          
          {/* Modern Hero Section with 3D Effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <ModernHero />
          </motion.div>
          
          {/* Interactive Technology Showcase */}
          {/* <InteractiveShowcase /> */}
          
          {/* Enhanced Featured Products Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="section-spacing"
          >
            <Enhanced3DSection
              title="Featured Products"
              products={featuredProducts}
              description="Discover our handpicked selection of premium mechanical keyboards, chosen for their exceptional quality and performance."
              gradient="from-primary/20 via-transparent to-accent/20"
            />
          </motion.div> */}
          
          {/* Category Exploration Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            transition={{ duration: 1.2, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10"
          >
            <CategorySection />
          </motion.div>
          
          {/* New Arrivals with 3D Enhancement */}
          {/* <Enhanced3DSection
            title="New Arrivals"
            products={newArrivals}
            description="Be the first to experience our latest keyboard innovations, featuring cutting-edge technology and stunning designs."
            gradient="from-secondary/20 via-transparent to-primary/20"
          /> */}

          {/* Technical Specifications Showcase */}
          {/* <TechSpecsSection /> */}

          {/* Advanced Scroll-to-top with 3D Effects */}
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 3, type: "spring", stiffness: 150, damping: 12 }}
          >
            <motion.button
              className="group relative w-14 h-14 bg-gradient-to-r from-primary via-accent to-secondary text-background rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-500 flex items-center justify-center overflow-hidden"
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                boxShadow: "0 0 30px rgba(191, 242, 5, 0.6)"
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Icon */}
              <motion.svg 
                className="w-6 h-6 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ y: -2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </motion.svg>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          {/* Floating Action Buttons */}
          <motion.div
            className="fixed left-8 bottom-8 z-50 space-y-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 3.2, duration: 1, ease: "easeOut" }}
          >
            {/* Quick Shop Button */}
            <motion.button
              className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              🛒
            </motion.button>
          </motion.div>

          {/* Ambient Particle Effects */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -80, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 5,
                  delay: Math.random() * 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Home;