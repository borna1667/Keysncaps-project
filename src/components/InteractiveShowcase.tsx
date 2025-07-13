import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Interactive Keyboard Model
function Interactive3DKeyboard() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={hovered ? 1.2 : 1}>
      {/* Keyboard Base */}
      <Box args={[8, 1, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.8}
        />
      </Box>
      
      {/* Individual Keys */}
      {Array.from({ length: 15 }, (_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2}>
          <Box 
            args={[0.4, 0.3, 0.4]} 
            position={[
              (i % 5) * 1.2 - 2.4,
              0.65,
              Math.floor(i / 5) * 0.8 - 0.8
            ]}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <meshStandardMaterial 
              color="#BFF205" 
              emissive="#BFF205"
              emissiveIntensity={hovered ? 0.3 : 0.1}
              roughness={0.1}
              metalness={0.9}
            />
          </Box>
        </Float>
      ))}
      
      {/* Glowing accent */}
      <Sphere args={[0.5]} position={[0, 2, 0]}>
        <MeshDistortMaterial
          color="#D7F205"
          transparent
          opacity={0.6}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </group>
  );
}

// Interactive Features Section
const InteractiveShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  const features = [
    {
      title: "RGB Backlighting",
      description: "16.7 million colors with per-key customization",
      icon: "🌈",
      gradient: "from-red-500 via-purple-500 to-blue-500"
    },
    {
      title: "Mechanical Precision",
      description: "Cherry MX switches for tactile perfection",
      icon: "⚡",
      gradient: "from-yellow-400 via-orange-500 to-red-500"
    },
    {
      title: "Wireless Freedom",
      description: "2.4GHz wireless with 100+ hour battery",
      icon: "📡",
      gradient: "from-green-400 via-blue-500 to-purple-600"
    },
    {
      title: "Gaming Optimized",
      description: "1ms response time and N-key rollover",
      icon: "🎮",
      gradient: "from-pink-400 via-purple-500 to-indigo-600"
    }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      style={{ opacity }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          style={{ y: springY, scale }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: 3D Interactive Model */}
          <motion.div 
            className="relative h-96 lg:h-[500px]"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#BFF205" />
              <pointLight position={[-10, -10, -10]} intensity={1} color="#D7F205" />
              <Interactive3DKeyboard />
            </Canvas>
            
            {/* Floating UI Elements */}
            <motion.div
              className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-primary/30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-primary font-bold text-sm">LIVE</div>
              <div className="text-white/70 text-xs">Interactive Demo</div>
            </motion.div>
          </motion.div>

          {/* Right: Feature Grid */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Next-Gen
                </span>
                <br />
                <span className="text-white">Features</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience the future of mechanical keyboards with cutting-edge technology 
                and precision engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-primary/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default InteractiveShowcase;
