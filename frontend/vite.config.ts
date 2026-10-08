import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  define: {
    // Expose the env variable to the app
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || ''),
  },
}));
