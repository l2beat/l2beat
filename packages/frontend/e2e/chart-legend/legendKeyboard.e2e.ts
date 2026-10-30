import { expect, type Locator, type Page, test } from 'playwright/test'

/**
 * Interactive legend items are toggle buttons: reachable with Tab, toggled
 * with Enter or Space like a click, and announcing whether their series is
 * shown. Checked on a chart that turns the legend onboarding off and on one
 * that keeps it.
 */
const CASES = [
  {
    name: 'Summary',
    page: '/layer2s/summary',
    legend: '.chart-legend',
    // this chart turns the "Try clicking legend items" hint off
    finishesOnboarding: false,
  },
  {
    name: 'Project TVS',
    page: '/layer2s/projects/arbitrum',
    legend: '#tvs .chart-legend',
    finishesOnboarding: true,
  },
]
/** A series' area; hiding the series removes it. */
const SERIES = '[data-ts-key$="-fill"]'
/** More than the controls between the top of a chart and its legend. */
const MAX_TABS = 30
/** Charts render once their data arrives, a few seconds on a cold server. */
const DATA_TIMEOUT = 30_000

for (const { name, page: path, legend, finishesOnboarding } of CASES) {
  test(`${name} legend items toggle with Enter and Space`, async ({ page }) => {
    await page.goto(path)
    const item = page.locator(`${legend} button[aria-pressed]`).first()
    await expect(item).toHaveAttribute('aria-pressed', 'true', {
      timeout: DATA_TIMEOUT,
    })
    const chart = await chartOf(item, SERIES)
    const shown = await chart.locator(SERIES).count()

    await tabTo(chart, item)
    const outline = await item.evaluate((e) => getComputedStyle(e).outlineStyle)
    expect(outline).not.toBe('none')

    await page.keyboard.press('Enter')
    await expect(item).toHaveAttribute('aria-pressed', 'false')
    // a hidden series dims its swatch and label, not the focus outline
    await expect(item).toHaveCSS('opacity', '1')
    await expect(chart.locator(SERIES)).toHaveCount(shown - 1)
    expect(await finishedOnboarding(page)).toBe(finishesOnboarding)

    await page.keyboard.press('Space')
    await expect(item).toHaveAttribute('aria-pressed', 'true')
    await expect(chart.locator(SERIES)).toHaveCount(shown)
  })
}

/**
 * Tabs from the top of `start`: tabbing from the top of a project page
 * takes hundreds of presses.
 */
async function tabTo(start: Locator, target: Locator) {
  await start.evaluate((e: HTMLElement) => {
    e.tabIndex = -1
    e.focus()
  })
  for (let i = 0; i < MAX_TABS; i++) {
    await start.page().keyboard.press('Tab')
    if (await target.evaluate((e) => e === document.activeElement)) return
  }
  throw new Error('Tab never reached the legend item')
}

/** The legend's chart: its closest ancestor that holds series marks. */
async function chartOf(item: Locator, selector: string) {
  const page = item.page()
  await expect(page.locator(selector).first()).toBeAttached()
  await item.evaluate((e, selector) => {
    let node = e.parentElement
    while (node && !node.querySelector(selector)) node = node.parentElement
    node?.setAttribute('data-legend-chart', '')
  }, selector)
  return page.locator('[data-legend-chart]')
}

async function finishedOnboarding(page: Page) {
  return await page.evaluate(
    () => localStorage.getItem('has-finished-legend-onboarding') === 'true',
  )
}
