import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// 3D Circuit Board Visualization
function CircuitBoard() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main board */}
      <Box args={[8, 0.2, 5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0a3d0a" roughness={0.8} metalness={0.2} />
      </Box>
      
      {/* Circuit traces */}
      {Array.from({ length: 20 }, (_, i) => (
        <Box
          key={i}
          args={[Math.random() * 2 + 0.5, 0.05, 0.1]}
          position={[
            (Math.random() - 0.5) * 7,
            0.15,
            (Math.random() - 0.5) * 4
          ]}
        >
          <meshStandardMaterial 
            color="#BFF205" 
            emissive="#BFF205"
            emissiveIntensity={0.3}
          />
        </Box>
      ))}
      
      {/* Components */}
      {Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={1 + Math.random()}>
          <Box
            args={[0.3, 0.4, 0.3]}
            position={[
              (Math.random() - 0.5) * 6,
              0.3,
              (Math.random() - 0.5) * 3
            ]}
          >
            <meshStandardMaterial color="#333" />
          </Box>
        </Float>
      ))}
      
      {/* Glowing points */}
      {Array.from({ length: 15 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.05]}
          position={[
            (Math.random() - 0.5) * 7,
            0.2,
            (Math.random() - 0.5) * 4
          ]}
        >
          <meshStandardMaterial 
            color="#D7F205" 
            emissive="#D7F205"
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Animated Data Visualization
function DataVisualization() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.5;
        child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3 + i * 0.3) * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 3]}>
      {Array.from({ length: 12 }, (_, i) => (
        <Cylinder
          key={i}
          args={[0.1, 0.1, Math.random() * 2 + 0.5]}
          position={[(i - 6) * 0.5, 0, 0]}
        >
          <meshStandardMaterial 
            color={i % 3 === 0 ? "#BFF205" : i % 3 === 1 ? "#D7F205" : "#83A603"}
            emissive={i % 3 === 0 ? "#BFF205" : i % 3 === 1 ? "#D7F205" : "#83A603"}
            emissiveIntensity={0.2}
          />
        </Cylinder>
      ))}
    </group>
  );
}

interface TechSpec {
  category: string;
  specs: {
    name: string;
    value: string;
    icon: string;
    description: string;
  }[];
}

const TechSpecsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredSpec, setHoveredSpec] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const techSpecs: TechSpec[] = [
    {
      category: "Performance",
      specs: [
        {
          name: "Response Time",
          value: "1ms",
          icon: "⚡",
          description: "Lightning-fast actuation for competitive gaming"
        },
        {
          name: "Polling Rate",
          value: "1000Hz",
          icon: "📊",
          description: "Ultra-responsive input detection"
        },
        {
          name: "Key Rollover",
          value: "N-Key",
          icon: "🔄",
          description: "Every key press registers independently"
        },
        {
          name: "Latency",
          value: "<0.1ms",
          icon: "🎯",
          description: "Virtually instantaneous response"
        }
      ]
    },
    {
      category: "Build Quality",
      specs: [
        {
          name: "Switch Type",
          value: "Cherry MX",
          icon: "🔧",
          description: "Premium mechanical switches rated for 50M clicks"
        },
        {
          name: "Frame Material",
          value: "Aluminum",
          icon: "💎",
          description: "Aircraft-grade aluminum construction"
        },
        {
          name: "Keycap Material",
          value: "PBT",
          icon: "🛡️",
          description: "Durable, shine-resistant PBT plastic"
        },
        {
          name: "Lifespan",
          value: "50M Clicks",
          icon: "♾️",
          description: "Engineered for decades of use"
        }
      ]
    },
    {
      category: "Connectivity",
      specs: [
        {
          name: "Connection",
          value: "2.4GHz/USB-C",
          icon: "📡",
          description: "Wireless freedom with wired reliability"
        },
        {
          name: "Battery Life",
          value: "100+ Hours",
          icon: "🔋",
          description: "Extended gaming sessions without interruption"
        },
        {
          name: "Range",
          value: "10 Meters",
          icon: "📏",
          description: "Stable connection across your setup"
        },
        {
          name: "Charging",
          value: "USB-C Fast",
          icon: "⚡",
          description: "Quick charge for minimal downtime"
        }
      ]
    },
    {
      category: "Customization",
      specs: [
        {
          name: "RGB Lighting",
          value: "16.8M Colors",
          icon: "🌈",
          description: "Per-key RGB with endless possibilities"
        },
        {
          name: "Profiles",
          value: "Unlimited",
          icon: "👤",
          description: "Create and store custom lighting profiles"
        },
        {
          name: "Software",
          value: "Advanced",
          icon: "💻",
          description: "Intuitive customization software"
        },
        {
          name: "Macros",
          value: "Programmable",
          icon: "🎮",
          description: "Complex macro programming support"
        }
      ]
    }
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
      style={{ opacity }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#BFF205" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        className="container-custom relative z-10"
        style={{ scale }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Technical
            </span>
            <br />
            <span className="text-white">Excellence</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Precision-engineered components deliver uncompromising performance and reliability
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: 3D Technical Visualization */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="relative h-96 lg:h-[500px] mb-8">
              <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#BFF205" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#D7F205" />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#FFFFFF" />
                
                <CircuitBoard />
                <DataVisualization />
              </Canvas>
            </div>

            {/* Category Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {techSpecs.map((category, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    activeCategory === index
                      ? 'bg-primary text-black border-primary'
                      : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-bold text-sm">{category.category}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Spec Details */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-3xl font-bold text-white mb-8">
                  {techSpecs[activeCategory].category} Specifications
                </h3>

                {techSpecs[activeCategory].specs.map((spec, index) => (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    onHoverStart={() => setHoveredSpec(index)}
                    onHoverEnd={() => setHoveredSpec(null)}
                    whileHover={{ scale: 1.02, y: -5 }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Background gradient on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredSpec === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="text-3xl">{spec.icon}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-white">{spec.name}</h4>
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {spec.value}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {spec.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar animation */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredSpec === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Performance Metrics Bar */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { metric: "Performance Score", value: 98, unit: "%" },
            { metric: "Build Quality", value: 95, unit: "%" },
            { metric: "User Rating", value: 4.9, unit: "/5" },
            { metric: "Reliability", value: 99, unit: "%" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {item.value}{item.unit}
              </div>
              <div className="text-gray-400 text-sm">{item.metric}</div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-1 mt-3">
                <motion.div
                  className="h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value > 5 ? item.value : item.value * 20}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default TechSpecsSection;
