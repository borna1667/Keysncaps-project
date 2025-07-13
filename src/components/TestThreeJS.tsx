import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';

// Simple test component to verify Three.js is working
function SimpleTestCube() {
  return (
    <Box args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#BFF205" />
    </Box>
  );
}

const TestThreeJS: React.FC = () => {
  return (
    <div className="w-full h-96 bg-gray-900">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <SimpleTestCube />
      </Canvas>
    </div>
  );
};

export default TestThreeJS;
