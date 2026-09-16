import { defineVitestConfig } from '@l2beat/vitest-config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig({
  test: {
    setupFiles: ['@l2beat/test-utils/setup'],
  },
})
