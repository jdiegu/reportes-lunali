import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: parseInt(process.env.VITE_DEV_PORT || '5174'),
    allowedHosts: [
         'saritashop-reportes.jdiegu.online'
    ],
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: process.env.VITE_API_TARGET || 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: process.env.VITE_API_TARGET || 'http://localhost:3000',
=======
        target: 'https://sarita-api.jdiegu.online',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://sarita-api.jdiegu.online/',
>>>>>>> bf530a5a88f02069f1f777d49e5f97bb5ce6f434
        changeOrigin: true
      }
    }
  }
})