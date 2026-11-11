import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// `npm run dev` and `npm run preview` forward /api to the HAN-improve API (recommend_api.py), so the
// browser talks to one address and no CORS setting is involved. Set HAN_API_URL in .env.local when
// the API runs on another port (see .env.example).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = { '/api': { target: env.HAN_API_URL || 'http://127.0.0.1:8000', changeOrigin: true } }
  return {
    plugins: [react()],
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
    test: { environment: 'jsdom', setupFiles: './src/test/setup.js' },
  }
})
