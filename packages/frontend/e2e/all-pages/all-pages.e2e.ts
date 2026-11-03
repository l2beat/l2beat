import { expect, test } from 'playwright/test'
import { MAIN_CONTENT_ID } from '~/components/SkipToContentLink'
import { getPages } from '~/server/pagePaths'

const PAGE_SHARD_COUNT = getPageShardCount()

test.describe.configure({ mode: 'parallel' })
test.setTimeout(5 * 60 * 1000)

for (let shardIndex = 0; shardIndex < PAGE_SHARD_COUNT; shardIndex++) {
  test(`all configured pages return non-empty successful responses (${shardIndex + 1}/${PAGE_SHARD_COUNT})`, async ({
    request,
  }) => {
    const pages = (await getPages()).map((page) => page.path)
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

        expectLandmarks(page, await response.text())
      })
    }
  })
}

test('the skip link is the first Tab stop and moves focus into main', async ({
  page,
}) => {
  await page.goto('/layer2s/summary')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Skip to content' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeInViewport()

  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

/**
 * Checked on the server-rendered HTML rather than in a browser, so it costs
 * nothing per page: one `<main>` per page, and on pages with anything to Tab
 * to, the skip link comes first.
 */
function expectLandmarks(path: string, html: string) {
  const mainCount = html.match(/<main\b/g)?.length ?? 0
  expect(mainCount, `${path} should have exactly one <main>`).toBe(1)

  const firstFocusable = html.match(
    /<(a|button|input|select|textarea)\b[^>]*>/,
  )?.[0]
  if (firstFocusable) {
    expect(firstFocusable, `${path} should start with the skip link`).toContain(
      `href="#${MAIN_CONTENT_ID}"`,
    )
  }
}

function getPageShardCount() {
  const parsed = Number.parseInt(process.env.ALL_PAGES_SHARDS ?? '16')

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 16
}
