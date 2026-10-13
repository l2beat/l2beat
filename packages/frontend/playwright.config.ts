import { defineConfig } from 'playwright/test'

// Socket Firewall (sfw) wraps npx/pnpm and injects HTTP_PROXY, which breaks
// Playwright's webServer readiness probe against localhost. Exempt local hosts.
process.env.NO_PROXY = [process.env.NO_PROXY, 'localhost,127.0.0.1']
  .filter(Boolean)
  .join(',')

process.env.CLIENT_SIDE_DEFI_ENABLED = 'true'
process.env.CLIENT_SIDE_BLOBS_PAGE = 'true'

/**
 * The ratchets count the work a page does, which other tests running beside
 * them push up, so they run once the rest are done, one at a time
 */
const PERF = '**/*-perf/**'
/** Off in CI for now, as the blobs ratchets are slow */
const RUN_BLOBS = !process.env.CI

const functional = [{ name: 'chromium', testIgnore: [PERF] }]

// biome-ignore lint/style/noDefaultExport: Playwright config uses a default export.
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:7357',
  },
  projects: [
    ...functional,
    {
      name: 'perf',
      testMatch: `${PERF}/*.e2e.ts`,
      testIgnore: RUN_BLOBS ? [] : ['**/blobs-perf/**'],
      dependencies: functional.map((project) => project.name),
      workers: 1,
    },
  ],
  webServer: {
    env: {
      PORT: '7357',
      LOG_LEVEL: 'ERROR',
      INTEROP_CHAINS: 'ethereum,arbitrum,base,optimism',
      CLIENT_SIDE_DEFI_ENABLED: 'true',
      CLIENT_SIDE_BLOBS_PAGE: 'true',
    },
    command: 'pnpm start:mock',
    url: 'http://localhost:7357',
    reuseExistingServer: !process.env.CI,
  },
})
