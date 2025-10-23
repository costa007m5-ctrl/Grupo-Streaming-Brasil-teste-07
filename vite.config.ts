import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
    
    return {
      server: {
        port: 5000,
        host: '0.0.0.0',
        strictPort: true,
        allowedHosts: ['.replit.dev', '.repl.co'],
        hmr: {
          clientPort: 443,
          protocol: 'wss',
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
