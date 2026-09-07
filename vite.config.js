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
        target: 'https://sarita-api.jdiegu.online',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://sarita-api.jdiegu.online/',
        changeOrigin: true
      }
    }
  }
})