import { type Browser, expect, type Page, test } from 'playwright/test'

/**
 * What a press does depends on the input, not the width. An iPad in
 * landscape is as wide as a laptop but has no hover, so a tap must open a
 * tooltip and hover-only controls must show; a narrow window still has a
 * mouse, so a click must follow a link.
 */
const IPAD_LANDSCAPE = {
  viewport: { width: 1366, height: 1024 },
  hasTouch: true,
  isMobile: true,
}
const NARROW_MOUSE_WINDOW = { viewport: { width: 1000, height: 800 } }
// Markdown links its glossary terms, and project pages are full of them.
const PROJECT_PAGE = '/scaling/projects/arbitrum'
const GLOSSARY_LINK = 'a[data-link-role="glossary"]'

test('a tap opens a tooltip on a wide touch screen, a second tap follows its link', async ({
  browser,
}) => {
  const page = await openPage(browser, IPAD_LANDSCAPE, PROJECT_PAGE)
  expect(await canHover(page)).toBe(false)

  const link = await hydratedGlossaryLink(page)
  const url = page.url()
  await link.tap()
  await expect(page.getByRole('tooltip')).toBeVisible()
  expect(page.url()).toBe(url)

  await link.tap()
  await page.waitForURL('**/glossary**')
  await page.context().close()
})

test('a click follows a tooltip link in a narrow mouse window', async ({
  browser,
}) => {
  const page = await openPage(browser, NARROW_MOUSE_WINDOW, PROJECT_PAGE)
  expect(await canHover(page)).toBe(true)

  const link = await hydratedGlossaryLink(page)
  await link.click()
  await page.waitForURL('**/glossary**')
  await page.context().close()
})

test('the glossary copy button shows without hover on a wide touch screen', async ({
  browser,
}) => {
  const page = await openPage(browser, IPAD_LANDSCAPE, '/glossary')
  await expect(page.locator('main section button').first()).toBeVisible()
  await page.context().close()
})

async function openPage(
  browser: Browser,
  options: Parameters<Browser['newContext']>[0],
  path: string,
) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  await page.goto(path, { waitUntil: 'networkidle' })
  return page
}

/** The query behind `useCanHover` and the `can-hover:` variant. */
function canHover(page: Page) {
  return page.evaluate(
    () => matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
}

/** A glossary link once its tooltip trigger has replaced the server's link. */
async function hydratedGlossaryLink(page: Page) {
  const link = page.locator(`${GLOSSARY_LINK}:visible`).first()
  await link.scrollIntoViewIfNeeded()
  const trigger = page.locator(`${GLOSSARY_LINK}[data-state]:visible`).first()
  await expect(trigger).toBeAttached()
  return trigger
}
