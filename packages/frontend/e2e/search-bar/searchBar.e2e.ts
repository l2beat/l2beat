import { expect, type Page, test } from 'playwright/test'

/**
 * Search results are links, so they can be opened in new tabs to compare
 * projects. Each test opens the search bar with its shortcut, types a query,
 * and checks where the browser goes and whether the dialog stays open:
 * opening a result in a new tab keeps it open so more can follow.
 */
const QUERY = 'arbitrum'

test('a result is a link to its page', async ({ page }) => {
  await searchFor(page, QUERY)
  await expect(firstResult(page)).toHaveAttribute('href', /^\//)
})

test('Enter opens the highlighted result in this tab', async ({ page }) => {
  await searchFor(page, QUERY)
  await page.keyboard.press('ArrowDown')
  const href = await highlightedResult(page).getAttribute('href')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL((url) => url.pathname === href)
})

test('Cmd/Ctrl+Enter opens the highlighted result in a new tab', async ({
  page,
  context,
}) => {
  await searchFor(page, QUERY)
  const href = await highlightedResult(page).getAttribute('href')
  const newTab = context.waitForEvent('page')
  await page.keyboard.press('ControlOrMeta+Enter')
  await expect(await newTab).toHaveURL((url) => url.pathname === href)
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('Cmd/Ctrl-click opens a result in a new tab', async ({
  page,
  context,
}) => {
  await searchFor(page, QUERY)
  const href = await firstResult(page).getAttribute('href')
  const newTab = context.waitForEvent('page')
  await firstResult(page).click({ modifiers: ['ControlOrMeta'] })
  await expect(await newTab).toHaveURL((url) => url.pathname === href)
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('middle-click opens a result in a new tab', async ({ page, context }) => {
  await searchFor(page, QUERY)
  const href = await firstResult(page).getAttribute('href')
  const newTab = context.waitForEvent('page')
  await firstResult(page).click({ button: 'middle' })
  await expect(await newTab).toHaveURL((url) => url.pathname === href)
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('a click opens a result in this tab', async ({ page }) => {
  await searchFor(page, QUERY)
  const href = await firstResult(page).getAttribute('href')
  await firstResult(page).click()
  await expect(page).toHaveURL((url) => url.pathname === href)
})

async function searchFor(page: Page, query: string) {
  await page.goto('/scaling/summary', { waitUntil: 'networkidle' })
  await page.keyboard.press('/')
  await page.getByRole('combobox').fill(query)
  // Results come from the server after a debounce.
  await expect(firstResult(page)).toContainText(/arbitrum/i)
}

function firstResult(page: Page) {
  return page.getByRole('option').first()
}

function highlightedResult(page: Page) {
  return page.locator('[role="option"][aria-selected="true"]')
}
