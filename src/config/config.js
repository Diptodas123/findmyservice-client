// API Configuration
// In development mode, always use localhost. In production, use env variable or remote URL
export const API_BASE_URL = import.meta.env.DEV
    ? 'http://localhost:8080'
    : import.meta.env.VITE_API_BASE_URL;

// Other configuration constants can be added here
export const APP_NAME = 'FindMyService';
export const DEFAULT_PAGE_SIZE = 20;
