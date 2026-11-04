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
 * them push up, so they run once the rest are done, one at a time. CI gives
 * them runners of their own instead, with --no-deps
 */
const PERF = '**/*-perf/**'
/**
 * The blobs ratchet watches a few of the chain's slots, 12 seconds apiece, so
 * it takes far longer than the rest. CI gives it a runner of its own
 */
const BLOBS_PERF = '**/blobs-perf/**'

// biome-ignore lint/style/noDefaultExport: Playwright config uses a default export.
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:7357',
  },
  projects: [
    { name: 'chromium', testIgnore: PERF },
    {
      name: 'perf',
      testMatch: `${PERF}/*.e2e.ts`,
      testIgnore: BLOBS_PERF,
      dependencies: ['chromium'],
      workers: 1,
    },
    {
      name: 'blobs perf',
      testMatch: `${BLOBS_PERF}/*.e2e.ts`,
      // after the rest, so nothing runs beside it
      dependencies: ['perf'],
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
