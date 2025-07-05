import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../public',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, 'src/app/components/ui'),
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/app/hooks')
    }
  }
})
