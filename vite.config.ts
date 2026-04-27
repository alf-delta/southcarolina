import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react-vendor';
        },
      },
    },
  },
})
