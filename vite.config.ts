import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Only compress images in CI/production — skips the slow step on local dev builds
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';

export default defineConfig({
  plugins: [
    react(),
    ...(isCI ? [ViteImageOptimizer({
      png:  { quality: 85 },
      jpeg: { quality: 85 },
      jpg:  { quality: 85 },
      webp: { quality: 85, lossless: false },
      gif:  {},
      tiff: {},
      logStats: true,
    })] : []),
  ],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('mapbox-gl')) return 'mapbox';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react-vendor';
        },
      },
    },
  },
})
