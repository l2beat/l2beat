import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@l2beat/vitest-config'

export default defineVitestConfig({
  // Vitest does not read tsconfig `paths`, so they are restated here.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
