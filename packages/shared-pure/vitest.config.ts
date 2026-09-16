import { defineConfig } from 'vitest/config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    env: { NODE_ENV: 'test' },
  },
})
