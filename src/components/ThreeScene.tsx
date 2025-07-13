import React from 'react';
import { Canvas } from '@react-three/fiber';

// Main Enhanced 3D Scene Component
const ThreeScene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <React.Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 2, 15], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.2} />
          
          {/* Main Key Lights */}
          <pointLight position={[15, 15, 15]} intensity={2} color="#BFF205" />
          <pointLight position={[-15, -15, -15]} intensity={1.5} color="#D7F205" />
          <pointLight position={[0, 20, 0]} intensity={1.8} color="#83A603" />
          
          {/* Accent Lights */}
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2} 
            color="#BFF205"
          />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.2} 
            color="#FFFFFF" 
          />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeScene;
