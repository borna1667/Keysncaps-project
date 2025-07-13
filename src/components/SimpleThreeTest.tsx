import * as React from 'react';

// Simple test component without Three.js to isolate the issue
const SimpleThreeTest = () => {
  return React.createElement('div', 
    { className: 'w-full h-96 bg-gray-900 flex items-center justify-center' },
    React.createElement('div', 
      { className: 'text-green-400 text-xl' },
      '✓ React is working - No Three.js in this component'
    )
  );
};

export default SimpleThreeTest;
