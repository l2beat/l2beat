import { expect, test } from 'playwright/test'

const SELECTED = /bg-autumn-300/

test('list panel arrows select the next and previous entry', async ({
  page,
}) => {
  await page.goto('/ui/p/honeypot')
  const entries = page.locator('li[data-address]')
  await expect(entries.first()).toBeVisible({ timeout: 30_000 })
  const count = await entries.count()
  expect(count).toBeGreaterThan(2)

  await entries.nth(0).click()
  await expect(entries.nth(0)).toHaveClass(SELECTED)

  await page.keyboard.press('ArrowDown')
  await expect(entries.nth(1)).toHaveClass(SELECTED)
  await expect(entries.nth(0)).not.toHaveClass(SELECTED)

  await page.keyboard.press('ArrowDown')
  await expect(entries.nth(2)).toHaveClass(SELECTED)

  await page.keyboard.press('ArrowUp')
  await expect(entries.nth(1)).toHaveClass(SELECTED)
  await expect(entries.nth(2)).not.toHaveClass(SELECTED)

  await entries.nth(count - 1).click()
  await page.keyboard.press('ArrowDown')
  await expect(entries.nth(count - 1)).toHaveClass(SELECTED)
})
