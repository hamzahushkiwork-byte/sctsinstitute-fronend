import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE || 'http://localhost:5000';

  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        // Proxy /uploads to backend
        '/uploads': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        // Proxy /api to backend
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
