import { defineVitestConfig } from '@l2beat/vitest-config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig({
  test: {
    setupFiles: ['@l2beat/test-utils/setup'],
    // Nearly every file here imports the whole project graph, so under the
    // preset's isolation the run is mostly that graph being loaded 31 times
    // over. These tests only read it - mocha already ran all of them in one
    // shared process - so a module registry per worker is safe, and it is the
    // single biggest win available here. See the commit message for numbers.
    isolate: false,
  },
})
