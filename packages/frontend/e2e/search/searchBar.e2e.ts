import { expect, type Page, test } from 'playwright/test'

/**
 * The search dialog and cmdk load in a chunk of their own, when the page is
 * idle or the search is hovered, focused or opened, so a page doesn't fetch
 * them before it renders. These tests keep the browser from ever being idle,
 * to see what each trigger does on its own.
 */
const PAGE = '/about-us'
const DIALOG_CHUNK = /\/SearchBarDialog-[\w-]+\.js$/

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.requestIdleCallback = () => 0
  })
})

test('the page loads without the search dialog', async ({ page }) => {
  const scripts: Promise<string>[] = []
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') {
      scripts.push(response.text())
    }
  })
  const dialogRequests = watchDialogRequests(page)

  await page.goto(PAGE, { waitUntil: 'networkidle' })

  for (const script of await Promise.all(scripts)) {
    expect(script).not.toContain('cmdk-root')
  }
  expect(dialogRequests.count).toBe(0)
})

test('hovering the search button loads the dialog', async ({ page }) => {
  await page.goto(PAGE, { waitUntil: 'networkidle' })
  const request = page.waitForRequest(DIALOG_CHUNK)
  await page.getByRole('button', { name: 'Search' }).hover()
  await request
})

test('keys typed while the dialog loads go into its input', async ({
  page,
}) => {
  const release = await holdDialogChunk(page)
  await page.goto(PAGE, { waitUntil: 'networkidle' })

  await page.keyboard.press('/')
  await page.keyboard.type('arbit')
  await page.keyboard.press('Backspace')
  await page.keyboard.type('trum')
  await release()

  const input = page.getByRole('dialog').getByRole('combobox')
  await expect(input).toBeFocused()
  await expect(input).toHaveValue('arbitrum')
  await page.keyboard.type(' one')
  await expect(input).toHaveValue('arbitrum one')
})

test('Escape while the dialog loads cancels opening it', async ({ page }) => {
  const release = await holdDialogChunk(page)
  await page.goto(PAGE, { waitUntil: 'networkidle' })

  await page.keyboard.press('/')
  await page.keyboard.type('arb')
  await page.keyboard.press('Escape')
  await release()
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await page.keyboard.press('/')
  await expect(page.getByRole('dialog').getByRole('combobox')).toHaveValue('')
})

function watchDialogRequests(page: Page) {
  const requests = { count: 0 }
  page.on('request', (request) => {
    if (DIALOG_CHUNK.test(request.url())) requests.count++
  })
  return requests
}

/** Holds the dialog's chunk back until the returned function is called. */
async function holdDialogChunk(page: Page) {
  const { promise: requested, resolve: onRequest } =
    Promise.withResolvers<void>()
  const { promise: released, resolve: release } = Promise.withResolvers<void>()
  await page.route(DIALOG_CHUNK, async (route) => {
    onRequest()
    await released
    await route.continue()
  })
  return async () => {
    await requested
    release()
  }
}
