import { defineVitestConfig } from '@l2beat/vitest-config'
import { testDatabase } from './src/test/harness'

const harness = testDatabase.vitestConfig('./src/test/globalSetup.ts')

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig({
  test: harness.test,
})
