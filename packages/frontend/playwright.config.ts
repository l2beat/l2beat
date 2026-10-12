import { defineConfig, devices } from 'playwright/test'

// Socket Firewall (sfw) wraps npx/pnpm and injects HTTP_PROXY, which breaks
// Playwright's webServer readiness probe against localhost. Exempt local hosts.
process.env.NO_PROXY = [process.env.NO_PROXY, 'localhost,127.0.0.1']
  .filter(Boolean)
  .join(',')

process.env.CLIENT_SIDE_DEFI_ENABLED = 'true'
process.env.CLIENT_SIDE_BLOBS_PAGE = 'true'

/**
 * The blobs page draws and lays itself out per screen, so its suite runs on
 * each kind of screen it is read on: iOS through WebKit, Android and desktop
 * through Chromium. The other suites set their own viewports and run once.
 */
const BLOBS_PAGE = '**/blobs-page/**'
const BLOBS_SCREENS = {
  desktop: { viewport: { width: 1440, height: 1000 } },
  android: devices['Pixel 7'],
  iphone: devices['iPhone 15'],
  ipad: devices['iPad Mini'],
}
/**
 * The ratchets count the work a page does, which other tests running beside
 * them push up, so they run once the rest are done, one at a time
 */
const PERF = '**/*-perf/**'

const functional = [
  { name: 'chromium', testIgnore: [BLOBS_PAGE, PERF] },
  ...Object.entries(BLOBS_SCREENS).map(([screen, use]) => ({
    name: `blobs ${screen}`,
    testMatch: `${BLOBS_PAGE}/*.e2e.ts`,
    use,
  })),
]

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
