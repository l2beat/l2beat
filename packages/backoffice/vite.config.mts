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
      '/trpc/local': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc\/local/, '/trpc'),
      },
      '/trpc/staging': {
        target: 'https://be-stag.l2beat.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc\/staging/, '/trpc'),
      },
      '/trpc/production': {
        target: 'https://be-prod.l2beat.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc\/production/, '/trpc'),
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
})
