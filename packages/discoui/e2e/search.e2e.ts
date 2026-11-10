import { expect, type Page, test } from 'playwright/test'

const ALL_PLACEHOLDER = 'Search contracts, fields, projects and commands'

// Each run starts from a fresh query so the next search, often one scoped
// inside what was just opened, needs no clearing first. Dismissing without
// running keeps the query, so an accidental Esc loses nothing.

test('running a result clears the query for the next search', async ({
  page,
}) => {
  const input = await openProject(page)

  await input.fill('InputBox')
  await expect(resultRow(page, 'InputBox')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(input).toBeHidden()
  await expect(searchTrigger(page)).toHaveText('Search')

  await page.keyboard.press('Control+k')
  await expect(input).toHaveValue('')
})

test('running a scoped result resets the scope to all', async ({ page }) => {
  const input = await openProject(page)

  await input.fill('>')
  await expect(input).not.toHaveAttribute('placeholder', ALL_PLACEHOLDER)
  await input.fill('Open values panel')
  await expect(resultRow(page, 'Open values panel')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(input).toBeHidden()

  await page.keyboard.press('Control+k')
  await expect(input).toHaveValue('')
  await expect(input).toHaveAttribute('placeholder', ALL_PLACEHOLDER)
})

test('dismissing the search keeps the query', async ({ page }) => {
  const input = await openProject(page)

  await input.fill('InputBox')
  await page.keyboard.press('Escape')
  await expect(input).toBeHidden()
  await expect(searchTrigger(page)).toHaveText('InputBox')

  await page.keyboard.press('Control+k')
  await expect(input).toHaveValue('InputBox')
})

async function openProject(page: Page) {
  await page.goto('/ui/p/honeypot')
  await expect(page.locator('li[data-address]').first()).toBeVisible({
    timeout: 30_000,
  })
  await page.keyboard.press('Control+k')
  const input = page.getByRole('dialog').getByRole('textbox')
  await expect(input).toBeFocused()
  return input
}

function resultRow(page: Page, title: string) {
  return page
    .getByRole('dialog')
    .locator('[data-index="0"]')
    .filter({ hasText: title })
}

function searchTrigger(page: Page) {
  return page.locator('button:has(kbd) span.truncate')
}
