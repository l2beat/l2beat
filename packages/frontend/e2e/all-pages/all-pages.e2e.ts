import { expect, test } from 'playwright/test'
import { resolvePages } from './pages'

const PAGE_SHARD_COUNT = getPageShardCount()
const pagesPromise = resolvePages()

test.describe.configure({ mode: 'parallel' })
test.setTimeout(5 * 60 * 1000)

for (let shardIndex = 0; shardIndex < PAGE_SHARD_COUNT; shardIndex++) {
  test(`all configured pages return non-empty successful responses (${shardIndex + 1}/${PAGE_SHARD_COUNT})`, async ({
    request,
  }) => {
    const pages = await pagesPromise
    const shardPages = pages
      .map((page, index) => ({ page, index }))
      .filter(({ index }) => index % PAGE_SHARD_COUNT === shardIndex)

    for (const { page, index } of shardPages) {
      await test.step(`${page} (${index + 1} of ${pages.length})`, async () => {
        const response = await request.get(page, {
          headers: {
            'User-Agent': 'L2Beat-Test/1.0',
          },
          timeout: 30000,
        })

        expect(
          response.ok(),
          `HTTP ${response.status()}: ${response.statusText()} - Failed to fetch ${response.url()}`,
        ).toBe(true)

        const contentLength = response.headers()['content-length']
        expect(
          contentLength === undefined || Number.parseInt(contentLength) > 0,
          `Empty response received from ${response.url()}`,
        ).toBe(true)
      })
    }
  })
}

function getPageShardCount() {
  const parsed = Number.parseInt(process.env.ALL_PAGES_SHARDS ?? '16')

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 16
}
