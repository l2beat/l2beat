import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import turbosnap from 'vite-plugin-turbosnap'

defineConfig({
  plugins: [react(), turbosnap({ rootDir: process.cwd() })],
  optimizeDeps: {
    exclude: ['@l2beat/discovery'],
    include: ['@l2beat/config', '@l2beat/shared-pure'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020',
  },
})
