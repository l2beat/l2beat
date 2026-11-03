import { type Browser, expect, type Page, test } from 'playwright/test'

/**
 * A tooltip mounts Radix the first time it is used, which replaces its
 * trigger's DOM node under the pointer or the focus. These use a never-used
 * trigger in the risk table and check, in a real browser, that the swap
 * keeps what Radix did before: the hover delay, closing when the pointer
 * leaves, focus staying where it was, and Escape closing.
 * The tap behaviour is covered in ../input-type/tapAndClick.e2e.ts.
 */
const PAGE = '/layer2s/risk'
/** The provider's delayDuration in AppLayout */
const HOVER_DELAY_MS = 300

test('hover opens a tooltip after the delay, leaving closes it', async ({
  browser,
}) => {
  const page = await openPage(browser)
  const trigger = nameCellTrigger(page, 2)
  await recordWhenTooltipAppears(page)

  await trigger.hover()
  await expect(page.getByRole('tooltip')).toBeVisible()
  const { firstMove, appeared } = await page.evaluate(() => window.__tooltip)
  expect(appeared - firstMove).toBeGreaterThanOrEqual(HOVER_DELAY_MS - 1)
  // The new node is the hovered one, so its own hover styles stay on
  expect(await trigger.evaluate((el) => el.matches(':hover'))).toBe(true)

  // One step, so the pointer never moves over the new node before it leaves
  await page.mouse.move(0, 0)
  await expect(page.getByRole('tooltip')).toBeHidden()
  await page.context().close()
})

test('focus opens a tooltip and stays on its trigger, Escape closes it', async ({
  browser,
}) => {
  const page = await openPage(browser)
  const trigger = nameCellTrigger(page, 3)

  await trigger.focus()
  await expect(page.getByRole('tooltip')).toBeVisible()
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('tooltip')).toBeHidden()
  await expect(trigger).toBeFocused()
  await page.context().close()
})

test('focus that lands inside a trigger stays on that element', async ({
  browser,
}) => {
  const page = await openPage(browser)
  const link = nameCellTrigger(page, 4).locator('> a')

  await link.focus()
  await expect(page.getByRole('tooltip')).toBeVisible()
  await expect(link).toBeFocused()
  await page.context().close()
})

declare global {
  interface Window {
    __tooltip: { firstMove: number; appeared: number }
  }
}

async function openPage(browser: Browser) {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()
  await page.goto(PAGE, { waitUntil: 'networkidle' })
  return page
}

/**
 * The project name in a row: a trigger around the project's link. Found by
 * its row, not by its node, as the node is replaced on first use.
 */
function nameCellTrigger(page: Page, row: number) {
  return page.locator('tbody tr').nth(row).locator('button:has(> a)').first()
}

/** In the page's clock, from the pointer's first move to the tooltip. */
function recordWhenTooltipAppears(page: Page) {
  return page.evaluate(() => {
    window.__tooltip = { firstMove: Number.NaN, appeared: Number.NaN }
    document.addEventListener(
      'pointermove',
      () => {
        window.__tooltip.firstMove = performance.now()
      },
      { capture: true, once: true },
    )
    new MutationObserver((_, observer) => {
      if (!document.querySelector('[role="tooltip"]')) return
      window.__tooltip.appeared = performance.now()
      observer.disconnect()
    }).observe(document.body, { childList: true, subtree: true })
  })
}
