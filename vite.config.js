import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The 'server' block has been removed. It is for local development only
  // and its settings (like port and allowedHosts) are not applicable to a
  // production deployment on a platform like Render, which handles these automatically.
})
