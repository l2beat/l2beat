import { defineVitestConfig } from '@l2beat/vitest-config'

const preset = defineVitestConfig()

/**
 * Runs only the config smoke test, which CI runs on its own against a target
 * environment's real variables before deploying to it. `include` replaces the
 * preset's globs instead of adding to them: `defineVitestConfig` concatenates
 * arrays, and the point of this config is to run one file and nothing else.
 */
// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default {
  ...preset,
  test: { ...preset.test, include: ['src/test/config-smoke-test.ts'] },
}
