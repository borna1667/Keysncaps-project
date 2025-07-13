import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

function SimpleBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#BFF205" />
    </mesh>
  );
}

const BasicThreeTest: React.FC = () => {
  return (
    <div className="w-full h-64 bg-gray-900">
      <Suspense fallback={<div className="text-white">Loading Three.js...</div>}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <SimpleBox />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default BasicThreeTest;
