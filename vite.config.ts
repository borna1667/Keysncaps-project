import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    define: {
      // Ensure environment variables are properly handled
      __APP_ENV__: JSON.stringify(mode)
    },
    // Production specific settings
    build: {
      minify: isProduction,
      sourcemap: !isProduction,
      // Improved chunk loading
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // Don't use direct file paths for chunking, use module names instead
          }
        }
      }
    },
    // Development server configuration
    server: {
      proxy: isProduction ? undefined : {
        '/create-payment-intent': {
          target: 'http://localhost:4242',
          changeOrigin: true,
        }
      }
    }
  };
});
