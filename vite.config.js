import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Ouve em todas as interfaces de rede
    port: Number(process.env.PORT) || 3000, // Usa a porta do Render ou 3000 como padrão
    allowedHosts: ['grupostreamingbrasil.onrender.com'],
  },
})
