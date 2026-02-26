import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    // Externalize workspace packages (CJS) so they're loaded via require()
    // instead of being processed through Vite's ESM pipeline
    external: [
      '@l2beat/config',
      '@l2beat/shared-pure',
      '@l2beat/shared',
      '@l2beat/backend-tools',
      '@l2beat/database',
      '@l2beat/dal',
      '@l2beat/validate',
    ],
  },
})
