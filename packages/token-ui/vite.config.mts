// @ts-expect-error
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/trpc': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
})
