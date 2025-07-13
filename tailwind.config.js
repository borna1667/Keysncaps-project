/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark mode primary palette using KloudPay colors
        'primary': '#BFF205',      // Bright lime for primary elements
        'secondary': '#83A603',    // Darker green for secondary elements
        'accent': '#D7F205',       // Light lime for accents
        'background': '#0D0D0D',   // Very dark background
        'dark': '#BFBFBF',         // Light gray for text on dark bg
        'light': '#1A1A1A',       // Dark surface color (cards, sections)
        'success': '#BFF205',      // Use lime for success
        'warning': '#D7F205',      // Light lime for warnings
        'error': '#FF4444',        // Keep red for errors but adjust for dark theme
        'kbd-navy': '#1E293B',
        'kbd-gray': '#94A3B8',
        'kbd-light-gray': '#E2E8F0',
        // KloudPay color palette (original values preserved)
        'kloud-lime': '#BFF205',
        'kloud-green': '#83A603',
        'kloud-light-lime': '#D7F205',
        'kloud-gray': '#BFBFBF',
        'kloud-dark': '#0D0D0D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-light': 'pulseLight 2s infinite',
        'key-press': 'keyPress 0.15s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseLight: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        keyPress: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(4px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};