import { motion } from 'framer-motion';
import ProductGrid from './ProductGrid';
import { Product } from '../types';

interface Enhanced3DSectionProps {
  title: string;
  products: Product[];
  description?: string;
  gradient?: string;
}

const Enhanced3DSection: React.FC<Enhanced3DSectionProps> = ({ 
  title, 
  products, 
  description,
  gradient = "from-primary/20 via-transparent to-accent/20"
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.section
      className="relative py-20 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Animated Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-heading font-bold mb-6"
            variants={itemVariants}
          >
            <motion.span
              className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              {title}
            </motion.span>
          </motion.h2>
          
          {description && (
            <motion.p
              className="text-xl text-dark/80 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              {description}
            </motion.p>
          )}

          {/* Decorative Line */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-8 rounded-full"
            variants={itemVariants}
            animate={{
              scaleX: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <ProductGrid products={products} />
        </motion.div>
      </div>

      {/* Side Gradients */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
    </motion.section>
  );
};

export default Enhanced3DSection;
