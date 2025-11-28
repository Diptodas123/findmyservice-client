import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_API = 'http://localhost:8080';
const API_URL = process.env.VITE_API_URL || DEFAULT_API;

// https://vite.dev/config/
export default defineConfig({
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
})
