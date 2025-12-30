/* global __dirname */
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify('test-cloud-name'),
    'import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET': JSON.stringify('test-upload-preset'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    exclude: ['**/node_modules/**', '**/e2e/**', '**/dist/**'],
    // Parallel execution with worker threads for faster test runs
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    // Enable test isolation to prevent state pollution
    isolate: true,
    // Reduce file watching overhead
    cache: {
      dir: 'node_modules/.vitest',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/dist/**',
        '**/*.spec.jsx',
        '**/*.test.jsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
