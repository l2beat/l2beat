import { expect, test } from 'playwright/test'

/**
 * The theme toggle animates the switch with a view transition. A second click
 * while one runs skips it, and the skipped transition's `ready` rejects. Both
 * clicks land in one task here, so the first transition cannot have started
 * yet and is always skipped.
 */
test('a double click on the theme toggle raises no error', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/layer2s/summary', { waitUntil: 'networkidle' })

  const toggle = page.locator('button[title="Change color scheme"]')
  await expect(toggle).toBeVisible()
  await toggle.evaluate((button: HTMLButtonElement) => {
    button.click()
    button.click()
  })

  // The rejection lands once the second transition replaces the first.
  await page.waitForTimeout(1500)
  expect(errors).toEqual([])
})
