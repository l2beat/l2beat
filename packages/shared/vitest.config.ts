import { defineVitestConfig } from '@l2beat/vitest-config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig({
  test: {
    include: ['{src,test}/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts', '@l2beat/test-utils/setup'],
  },
})
