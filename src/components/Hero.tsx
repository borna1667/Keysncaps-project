import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KeyProps {
  children: React.ReactNode;
  wide?: boolean;
  wider?: boolean;
  widest?: boolean;
}

const Key = ({ children, wide, wider, widest }: KeyProps) => {
  let width = 'w-4 sm:w-10';
  const [isPressed, setIsPressed] = useState(false);

  if (wide) width = 'w-7 sm:w-16';
  if (wider) width = 'w-10 sm:w-20';
  if (widest) width = 'w-14 sm:w-32';

  const handleClick = () => {
    setIsPressed(true);
    // Play a keyboard sound if desired
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  return (
    <div 
      className={`${width} h-4 sm:h-10 flex items-center justify-center font-medium rounded text-[8px] sm:text-sm bg-light border border-secondary/40 shadow-sm transition-transform duration-100 hover:scale-105 active:scale-95 hover:z-10 hover:shadow-md cursor-pointer ${isPressed ? 'transform translate-y-0.5 sm:translate-y-1 bg-primary/30 shadow-inner border-primary text-background' : 'text-dark'}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

const Hero: React.FC = () => {
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keys = keyboardRef.current?.querySelectorAll('div[class*="flex items-center justify-center"]');
    if (!keys) return;

    const animateRandomKey = () => {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      randomKey.classList.add('animate-key-press');
      
      setTimeout(() => {
        randomKey.classList.remove('animate-key-press');
      }, 300);
    };

    const interval = setInterval(animateRandomKey, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-kloud-dark/80 to-background/60 pt-16 pb-6 sm:pt-16 md:pt-24 lg:pt-32 sm:pb-12 md:pb-16 lg:pb-24">
      <div className="container-custom px-3 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-in text-center md:text-left relative z-10">
            <h1 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-dark mt-10 sm:mt-0">
              Elevate Your Typing Experience
            </h1>
            <p className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg text-dark/80 max-w-lg mx-auto md:mx-0">
              Discover Europe's finest collection of premium mechanical keyboards designed for enthusiasts, gamers, and professionals.
            </p>
            <div className="mt-4 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <Link 
                to="/products" 
                className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-background font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                Shop Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-light/90 hover:bg-light text-dark border-2 border-secondary font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* For tablets and larger - full keyboard */}
          <div className="relative animate-slide-up mt-8 md:mt-0 hidden sm:block">
            <div ref={keyboardRef} className="relative bg-light/90 p-4 sm:p-6 rounded-xl shadow-xl sm:shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out"> 
              {/* Keyboard rows */} 
              <div className="space-y-3">
                <div className="flex space-x-2"> 
                  <Key>ESC</Key> 
                  <Key>F1</Key> 
                  <Key>F2</Key> 
                  <Key>F3</Key> 
                  <Key>F4</Key> 
                  <Key>F5</Key> 
                  <Key>F6</Key> 
                </div> 
                <div className="flex space-x-2"> 
                  <Key>`</Key> 
                  <Key>1</Key> 
                  <Key>2</Key> 
                  <Key>3</Key> 
                  <Key>4</Key> 
                  <Key>5</Key> 
                  <Key>6</Key> 
                </div> 
                <div className="flex space-x-2"> 
                  <Key wide>TAB</Key> 
                  <Key>Q</Key> 
                  <Key>W</Key> 
                  <Key>E</Key> 
                  <Key>R</Key> 
                  <Key>T</Key> 
                </div> 
                <div className="flex space-x-2"> 
                  <Key wide>CAPS</Key> 
                  <Key>A</Key> 
                  <Key>S</Key> 
                  <Key>D</Key> 
                  <Key>F</Key> 
                </div> 
                <div className="flex space-x-2"> 
                  <Key wider>SHIFT</Key> 
                  <Key>Z</Key> 
                  <Key>X</Key> 
                  <Key>C</Key> 
                </div> 
                <div className="flex space-x-2"> 
                  <Key>CTRL</Key> 
                  <Key>ALT</Key> 
                  <Key widest>SPACE</Key> 
                </div> 
              </div>
              {/* RGB light effect */}
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-primary to-accent rounded-b-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 md:-mt-20 md:-mr-20 hidden sm:block">
        <div className="w-32 h-32 md:w-64 md:h-64 rounded-full bg-primary/20"></div>
      </div>
      <div className="absolute bottom-0 left-1/4 -mb-6 md:-mb-12 hidden sm:block">
        <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-secondary/10"></div>
      </div>
    </div>
  );
};

export default Hero;