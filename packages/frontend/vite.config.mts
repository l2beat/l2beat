import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { smallSharedChunks } from './smallSharedChunks.mts'
import {
  CLIENT_ASSETS_DIR,
  CLIENT_BASE_PATH,
  CLIENT_OUTPUT_DIR,
} from './src/paths.mts'

// biome-ignore lint/style/noDefaultExport: Vite requires default export
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: isBuild ? CLIENT_BASE_PATH : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      outDir: CLIENT_OUTPUT_DIR,
      assetsDir: CLIENT_ASSETS_DIR,
      emptyOutDir: true,
      // Read by PagePreloads to emit modulepreload tags per page.
      manifest: true,
      rolldownOptions: {
        output: {
          // A threshold of 8 kB of source cut a project page from 166 chunks
          // to 50 and added at most 14 kB gzipped to any page measured
          codeSplitting: { groups: [smallSharedChunks(8_000)] },
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
