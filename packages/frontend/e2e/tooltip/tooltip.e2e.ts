import { type Browser, expect, type Page, test } from 'playwright/test'

/**
 * Tooltips in the risk table, checked in a real browser: the hover delay,
 * closing when the pointer leaves, focus opening and staying put, and Escape
 * closing. The tap behaviour is covered in ../input-type/tapAndClick.e2e.ts.
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

test('an open tooltip describes its trigger once', async ({ browser }) => {
  const page = await openPage(browser)
  // A risk cell keeps its content in the HTML as a hidden description.
  const triggerId = await page
    .locator('tbody tr')
    .nth(2)
    .locator('button[aria-describedby$="-description"]')
    .first()
    .getAttribute('id')
  // By id, as opening changes what the trigger is described by.
  const trigger = page.locator(`[id="${triggerId}"]`)
  const closedDescription = await trigger.getAttribute('aria-describedby')

  await trigger.hover()
  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toBeVisible()
  await expect(trigger).toHaveAttribute(
    'aria-describedby',
    (await tooltip.getAttribute('id')) ?? '',
  )
  await expect(trigger).toHaveAccessibleDescription(
    (await tooltip.innerText()).replace(/\s+/g, ' ').trim(),
  )

  await page.mouse.move(0, 0)
  await expect(tooltip).toBeHidden()
  await expect(trigger).toHaveAttribute(
    'aria-describedby',
    closedDescription ?? '',
  )
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

test('focus opens a tooltip whose trigger was disabled at first', async ({
  browser,
}) => {
  const page = await openPage(browser, '/layer2s/compare')
  // Its tooltip is disabled until the chart limit is reached
  const add = page.getByRole('button', { name: 'Add chart' })
  while ((await add.getAttribute('aria-disabled')) !== 'true') {
    await add.click()
  }
  await page.mouse.move(0, 0)

  // Focus opens tooltips only when it shows, so after those clicks the
  // button is reached by keyboard.
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(add).toBeFocused()
  await expect(page.getByRole('tooltip')).toBeVisible()
  await page.context().close()
})

declare global {
  interface Window {
    __tooltip: { firstMove: number; appeared: number }
  }
}

async function openPage(browser: Browser, path = PAGE) {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()
  await page.goto(path, { waitUntil: 'networkidle' })
  return page
}

/** The project name in a row: a trigger around the project's link. */
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
