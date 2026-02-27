import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: isBuild ? '/static/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist/static',
      emptyOutDir: false,
      manifest: true,
      rollupOptions: {
        input: path.resolve(__dirname, './src/ssr/ClientEntry.tsx'),
        output: {
          manualChunks(id) {
            if (!id.includes('/node_modules/')) return
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/')
            ) {
              return 'react-vendor'
            }
            if (id.includes('/recharts/') || id.includes('/d3-')) {
              return 'charts-vendor'
            }
            if (id.includes('/@tanstack/')) {
              return 'tanstack-vendor'
            }
            if (id.includes('/@radix-ui/')) {
              return 'radix-vendor'
            }
            return 'other-vendor'
          },
        },
      },
    },
    ssr: {
      // Externalize all dependencies (including linked workspace packages)
      // so CommonJS workspace builds are loaded via Node require().
      external: true,
    },
  }
})
