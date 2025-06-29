import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT || '3000'}`,
          changeOrigin: true,
        },
      },
    },
  };
});