import React from 'react';
import { Category } from '../types';

// Icons for each category
import { Keyboard, Wifi, Gamepad2, MinusSquare, Package } from 'lucide-react';

interface KeyboardKeyFilterProps {
  category: Category | 'All';
  isSelected: boolean;
  onClick: () => void;
}

const KeyboardKeyFilter: React.FC<KeyboardKeyFilterProps> = ({
  category,
  isSelected,
  onClick
}) => {
  // Get the appropriate icon for each category
  const getIcon = () => {
    switch (category) {
      case 'Keyboard':
        return <Keyboard className="h-5 w-5" />;
      case 'Wireless':
        return <Wifi className="h-5 w-5" />;
      case 'Gaming':
        return <Gamepad2 className="h-5 w-5" />;
      case 'Compact':
        return <MinusSquare className="h-5 w-5" />;
      case 'Accessories':
        return <Package className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-24 h-24 md:w-28 md:h-28 rounded-lg 
        transform transition-all duration-150 
        ${isSelected 
          ? 'bg-primary text-white translate-y-1 shadow-inner' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-[0_5px_0_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.08)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.08)] hover:translate-y-0.5'
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="mb-2">
        {getIcon()}
      </span>
      <span className="font-medium text-sm">{category}</span>
      
      {/* Key switch visualization */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-300 rounded hidden md:block" />
    </button>
  );
};

export default KeyboardKeyFilter;
