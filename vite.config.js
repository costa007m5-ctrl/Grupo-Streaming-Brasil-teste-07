import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is not needed for Vercel, but good for local dev if you have API routes
    proxy: {
      '/api': 'http://localhost:3001' // Adjust if your local API runs elsewhere
    }
  }
})
