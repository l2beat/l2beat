import { expect, test } from 'playwright/test'

/**
 * Keyboard and screen-reader users sort through the header's sort buttons.
 * This tabs through them, sorts with Enter and Space, and reads the result
 * from the real table's `aria-sort`, the way a screen reader would.
 * The visible sort buttons live in the sticky header's copy, so this also
 * checks the copy and the real header stay in step.
 */
test('a table header sorts from the keyboard', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()
  await page.goto('/layer2s/summary', { waitUntil: 'networkidle' })

  const proofSystemHeader = page.getByRole('columnheader', {
    name: 'Proof system',
  })
  const valueSecuredHeader = page.getByRole('columnheader', {
    name: 'Total value secured',
  })
  await expect(proofSystemHeader).toHaveAttribute('aria-sort', 'none')
  await expect(valueSecuredHeader).toHaveAttribute('aria-sort', 'descending')

  // `#` is pinned, so its button sits in a separate layer of the header copy.
  // Focus must still meet it first, where it shows.
  await page.getByRole('button', { name: /^name$/i }).focus()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: /^#$/ })).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: /^proof system$/i }),
  ).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(valueSecuredHeader).toHaveAttribute('aria-sort', 'none')
  const firstDirection = await proofSystemHeader.getAttribute('aria-sort')
  expect(['ascending', 'descending']).toContain(firstDirection)

  await page.keyboard.press('Space')
  await expect(proofSystemHeader).toHaveAttribute(
    'aria-sort',
    firstDirection === 'ascending' ? 'descending' : 'ascending',
  )

  await context.close()
})
