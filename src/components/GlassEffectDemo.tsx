import React from 'react';

const GlassEffectDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 pt-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Demo Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-200 mb-4">
            Frosted Glass Navigation & Footer Demo
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A modern frosted glass navigation bar with animated blue underglow and matching footer. 
            Built with React, Vite, and TailwindCSS on a charcoal background.
          </p>
        </div>

        {/* Glass Cards Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item}
              className="relative backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:bg-gray-900/70 hover:border-gray-600/50 hover:shadow-lg hover:shadow-blue-500/20 group"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-gray-800/20 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-gray-200 mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  Glass Card {item}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  This is a demonstration of the frosted glass effect with subtle animations and hover states.
                </p>
                
                <button className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Navigation Features</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Fixed/sticky positioning with scroll detection
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Backdrop blur with translucent background
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Animated blue underglow effect
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Responsive mobile menu
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Footer Features</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Matching glass styling with hover effects
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Responsive 4-column layout
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Subtle text shadows on hover
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Mobile-friendly design
              </li>
            </ul>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="text-center mt-16 mb-32">
          <div className="inline-flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2">Scroll to see navigation effects</span>
            <div className="w-px h-8 bg-gradient-to-b from-blue-400/50 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Spacer content to enable scrolling */}
        <div className="h-96"></div>
        <div className="text-center">
          <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl p-8 inline-block">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Scroll Test Area</h3>
            <p className="text-gray-400">Notice how the navigation bar changes as you scroll!</p>
          </div>
        </div>
        <div className="h-96"></div>
      </div>
    </div>
  );
};

export default GlassEffectDemo;
