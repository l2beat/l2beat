import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import {
  CLIENT_ASSETS_DIR,
  CLIENT_BASE_PATH,
  CLIENT_OUTPUT_DIR,
} from './src/paths'

// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: isBuild ? CLIENT_BASE_PATH : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: CLIENT_OUTPUT_DIR,
      assetsDir: CLIENT_ASSETS_DIR,
      emptyOutDir: true,
      // Read by PagePreloads to emit modulepreload tags per page.
      manifest: true,
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 1024,
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
