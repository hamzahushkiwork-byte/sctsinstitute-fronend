import { API_BASE } from '../config/api.js';

/**
 * Convert a media path to a URL
 * - In dev: returns relative URL (uses Vite proxy, no CORS)
 * - In prod: returns absolute URL if needed
 * @param {string} path - Media path (can be relative or absolute)
 * @returns {string} URL (relative in dev, absolute in prod if needed)
 */
export function toAbsoluteMediaUrl(path) {
  if (!path) {
    return '';
  }

  // If already an absolute URL (starts with http:// or https://), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // In development, use relative URLs (Vite proxy handles CORS)
  // In production, build absolute URL if needed
  if (import.meta.env.DEV) {
    // Ensure path starts with /
    return path.startsWith('/') ? path : '/' + path;
  }

  // Production: build absolute URL
  const normalizedPath = path.startsWith('/') ? path : '/' + path;

  // CRITICAL: If the path starts with /assets/ it's likely a frontend asset from the build
  // We should NOT prepend API_BASE for frontend assets
  if (normalizedPath.startsWith('/assets/')) {
    return normalizedPath;
  }

  return API_BASE + normalizedPath;
}

