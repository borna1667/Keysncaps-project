import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Interactive 3D Keyboard Key
function Interactive3DKey({ position, color = "#BFF205" }: { 
  position: [number, number, number]; 
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.8, 0.15]} />
        <meshStandardMaterial
          color={hovered ? "#D7F205" : color}
          emissive={hovered ? "#BFF205" : color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

// Morphing Background Sphere
function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 32, 32]} position={[4, 0, -3]}>
      <MeshDistortMaterial
        color="#BFF205"
        transparent
        opacity={0.3}
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

// 3D Scene for Hero
function Hero3DScene() {
  const keys = [
    { text: 'K', position: [-2, 1, 0] as [number, number, number] },
    { text: 'E', position: [-1, 0.5, 0.5] as [number, number, number] },
    { text: 'Y', position: [0, 1.2, -0.3] as [number, number, number] },
    { text: 'S', position: [1, 0.8, 0.2] as [number, number, number] },
    { text: '&', position: [2, 1.5, -0.1] as [number, number, number] },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ height: '100%', width: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#BFF205" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#D7F205" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#BFBFBF" />

      {keys.map((key, index) => (
        <Interactive3DKey
          key={index}
          position={key.position}
          color={index % 2 === 0 ? "#BFF205" : "#83A603"}
        />
      ))}

      <MorphingSphere />
    </Canvas>
  );
}

const ModernHero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-kloud-dark via-background to-kloud-dark">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
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

      <div className="container-custom px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Keys
              </motion.span>
              <motion.span
                className="block text-dark mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                &amp; Caps
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-dark/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Experience the future of typing with our premium mechanical keyboards, 
              designed for enthusiasts who demand perfection.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/products"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-background font-bold rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 text-lg"
                >
                  Explore Collection
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 bg-light/90 hover:bg-light text-dark border-2 border-primary/30 hover:border-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-dark/70">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">50+</div>
                <div className="text-sm text-dark/70">Premium Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-dark/70">Support</div>
              </div>
            </motion.div>
          </motion.div>


        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ModernHero;
