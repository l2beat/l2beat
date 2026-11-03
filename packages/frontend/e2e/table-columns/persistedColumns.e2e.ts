import { expect, test } from 'playwright/test'

/**
 * Columns hidden in the column picker are stored per table and hidden by a
 * pre-paint `<style>` until React applies them (persistedColumnVisibility.ts).
 * That style outlives the page's first render, so it must stay off for good
 * once React owns visibility: clearing the choice in another tab shows the
 * column again rather than letting the stale rule hide it.
 *
 * The test stores a hidden column, loads the page, then clears the stored
 * value from a second tab of the same browser, which fires a `storage` event
 * in the first.
 */
const PAGE = '/scaling/risk'
const TABLE_ID = 'L2RiskTable'
const STORAGE_KEY = `table-column-visibility-${TABLE_ID}`

test('a column hidden in another session shows again once the choice is cleared', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()
  await page.goto(PAGE, { waitUntil: 'load' })
  // Not the sticky header's copies, which are presentational.
  const table = page.locator(
    `table[data-table-id="${TABLE_ID}"]:not([role=presentation])`,
  )
  // The last column whose id needs no escaping in a selector.
  const columnId = await table
    .locator('tbody tr')
    .first()
    .evaluate((row) =>
      [...row.querySelectorAll('td[data-column-id]')]
        .map((cell) => cell.getAttribute('data-column-id') ?? '')
        .findLast((id) => /^[\w-]+$/.test(id)),
    )
  expect(columnId).toBeTruthy()
  const cell = table.locator(`tbody td[data-column-id="${columnId}"]`).first()

  await page.evaluate(
    ([key, id]) => localStorage.setItem(key!, JSON.stringify({ [id!]: false })),
    [STORAGE_KEY, columnId],
  )
  await page.reload({ waitUntil: 'load' })
  await expect(cell).toBeHidden()
  await expect(table).toHaveAttribute('data-columns-applied', '')

  const otherTab = await context.newPage()
  await otherTab.goto(PAGE, { waitUntil: 'load' })
  await otherTab.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY)

  await expect(cell).toBeVisible()
  await context.close()
})
