import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

// 3D Loading Animation
function LoadingGeometry() {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <Sphere args={[1, 16, 16]}>
          <meshStandardMaterial
            color="#BFF205"
            emissive="#BFF205"
            emissiveIntensity={0.3}
            wireframe
          />
        </Sphere>
      </Float>
      
      {/* Orbiting cubes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Float key={i} speed={1 + Math.random()}>
            <Box
              args={[0.2, 0.2, 0.2]}
              position={[
                Math.cos(angle) * 2,
                Math.sin(angle) * 2,
                Math.sin(angle * 2) * 0.5
              ]}
            >
              <meshStandardMaterial
                color="#D7F205"
                emissive="#D7F205"
                emissiveIntensity={0.4}
              />
            </Box>
          </Float>
        );
      })}
    </group>
  );
}

interface FuturisticLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  const loadingStages = [
    'Initializing',
    'Loading 3D Assets',
    'Rendering Components',
    'Optimizing Performance',
    'Finalizing Experience'
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5; // Ensure faster progress
          
          // Update loading text based on progress
          const stageIndex = Math.min(
            Math.floor((newProgress / 100) * loadingStages.length),
            loadingStages.length - 1
          );
          setLoadingText(loadingStages[stageIndex]);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete?.(), 300); // Reduced delay
            return 100;
          }
          return newProgress;
        });
      }, 100); // Faster updates

      // Fallback timeout to ensure loading doesn't hang
      const fallbackTimeout = setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        onComplete?.();
      }, 3000); // Maximum 3 seconds

      return () => {
        clearInterval(interval);
        clearTimeout(fallbackTimeout);
      };
    }
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="loadingGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <motion.path
                    d="M 5 0 L 0 0 0 5"
                    fill="none"
                    stroke="#BFF205"
                    strokeWidth="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#loadingGrid)" />
            </svg>
          </div>

          {/* Matrix-style falling code */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute text-xs text-primary/30 font-mono whitespace-pre"
                style={{
                  left: `${(i * 5) % 100}%`,
                  top: '-10%'
                }}
                animate={{
                  y: ['0vh', '110vh']
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear'
                }}
              >
                {Array.from({ length: 30 }, () => 
                  Math.random() > 0.5 ? '1' : '0'
                ).join('\n')}
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {/* 3D Loading Animation */}
            <div className="w-32 h-32 mx-auto mb-8">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#BFF205" />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color="#D7F205" />
                <LoadingGeometry />
              </Canvas>
            </div>

            {/* Brand Logo/Text */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                Keys'n'Caps
              </h1>
              <p className="text-gray-400 text-sm">Experience the Future of Typing</p>
            </motion.div>

            {/* Loading Progress */}
            <div className="space-y-4">
              <motion.div
                className="text-white font-medium"
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {loadingText}...
              </motion.div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                
                {/* Glowing effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full opacity-50 blur-sm"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              {/* Progress Percentage */}
              <div className="text-sm text-gray-400">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Loading Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FuturisticLoader;
