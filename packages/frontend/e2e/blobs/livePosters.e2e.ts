import { expect, test } from 'playwright/test'

/**
 * The posters table is drawn after the belt on first load, so the belt shows
 * sooner on a phone. This guards the other half: the table still fills in.
 *
 * Method: open /blobs at a phone's size and wait for the status to read Live,
 * then for the table's poster rows, each with a name and a blob count.
 */
test('the posters table fills in once /blobs is live', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto('/blobs')

  await page.getByRole('status').filter({ hasText: 'Live' }).waitFor()
  const rows = page.locator('#live-posters tbody tr[data-flip-key]')
  await expect(rows.first()).toBeVisible()
  expect(await rows.count()).toBeGreaterThan(1)
  await expect(rows.first()).toContainText(/\d/)

  await context.close()
})
