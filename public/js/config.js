/**
 * TPO Connect — Dynamic Public Configuration
 * Automatically detects hosting environment (Render, Vercel, Localhost)
 */
window.APP_CONFIG = {
  API_BASE_URL: (typeof window !== 'undefined' && window.location.port && window.location.port !== '5000' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000/api'
    : '/api',
  APP_NAME: 'TPO CONNECT',
  VERSION: '1.0.0'
};
