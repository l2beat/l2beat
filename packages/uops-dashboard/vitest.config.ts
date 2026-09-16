import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@l2beat/vitest-config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig({
  // Vitest does not read tsconfig `paths`, so they are restated here.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    setupFiles: ['@l2beat/test-utils/setup'],
  },
})
