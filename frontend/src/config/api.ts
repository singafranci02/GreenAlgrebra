// API Configuration
// Uses environment variable in production, localhost in development

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to ensure API URL ends without trailing slash
export const getApiUrl = (endpoint: string) => {
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

