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
    port: parseInt(process.env.VITE_DEV_PORT || '5172'),
    proxy: {
      '/api': {
        target: 'http://31.97.136.227:3001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://31.97.136.227:3001',
        changeOrigin: true
      }
    }
  }
})