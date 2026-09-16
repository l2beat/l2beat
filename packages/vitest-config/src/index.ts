import { mergeConfig, type ViteUserConfig } from 'vitest/config'

/**
 * The single source of truth for how tests run in this monorepo. A package
 * adopts Vitest with a one-line `vitest.config.ts` that calls this, so no
 * package drifts on include patterns, env or pool settings.
 *
 * `overrides` are merged on top of the preset the way Vite merges configs —
 * arrays are concatenated rather than replaced — which is how a package adds
 * its own `globalSetup` or `setupFiles` without restating the preset.
 */
export function defineVitestConfig(
  overrides: ViteUserConfig = {},
): ViteUserConfig {
  return mergeConfig(preset, overrides)
}

const preset: ViteUserConfig = {
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    env: { NODE_ENV: 'test' },
    reporters: reporters(),
    // Pinned rather than left to Vitest's defaults: suites here lean on
    // module-level singletons and env vars, so a fresh forked process per test
    // file is what keeps them from leaking into each other.
    pool: 'forks',
    isolate: true,
  },
}

/**
 * `dot` rather than Vitest's `default`, because `turbo run test` interleaves
 * 22 packages into one stream and a per-suite tree from each of them buries
 * the failures. `dot` spends one character per test and still prints every
 * failure in full at the end.
 *
 * `github-actions` turns those failures into annotations on the changed lines
 * of a pull request. Vitest appends it on its own, but only for as long as
 * `reporters` is left untouched, so setting one here means setting both.
 */
function reporters(): string[] {
  return process.env.GITHUB_ACTIONS === 'true'
    ? ['dot', 'github-actions']
    : ['dot']
}
