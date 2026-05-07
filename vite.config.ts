import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png:  { quality: 85 },
      jpeg: { quality: 85 },
      jpg:  { quality: 85 },
      webp: { quality: 85, lossless: false },
      gif:  {},
      tiff: {},
      logStats: true,
    }),
  ],
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
