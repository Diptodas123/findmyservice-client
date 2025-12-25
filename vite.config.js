import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cwd } from 'node:process'

const DEFAULT_API = 'http://localhost:8080';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, cwd(), '');
  
  // Use local API in development, remote API in production
  const API_URL = mode === 'development' ? DEFAULT_API : (env.VITE_API_BASE_URL || DEFAULT_API);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
})
