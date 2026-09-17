import path from 'node:path'
import { defineVitestConfig } from '@l2beat/vitest-config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig({
  // Restated from vite.config.mts because Vitest loads this file instead of
  // that one, and 18 test files import through the alias.
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, './src'),
    },
  },
})
