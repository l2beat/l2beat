import { defineConfig } from 'playwright/test'

// Socket Firewall (sfw) wraps npx/pnpm and injects HTTP_PROXY, which breaks
// Playwright's webServer readiness probe against localhost. Exempt local hosts.
process.env.NO_PROXY = [process.env.NO_PROXY, 'localhost,127.0.0.1']
  .filter(Boolean)
  .join(',')

const PORT = 2022

// biome-ignore lint/style/noDefaultExport: Playwright config uses a default export.
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  workers: process.env.CI ? 4 : undefined,
  use: {
    baseURL: process.env.BASE_URL ?? `http://localhost:${PORT}`,
  },
  webServer: {
    command: 'pnpm --dir ../l2b dev ui',
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/health`,
    reuseExistingServer: !process.env.CI,
  },
})
