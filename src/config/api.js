const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
export const API_BASE = rawBase.replace(/\/api\/v1\/?$/, '');
export const API_BASE_URL = `${API_BASE}/api/v1`;
