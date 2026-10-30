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
    const chart = await chartOf(item)
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

/** The legend's chart: the legend's parent, once its series are drawn. */
async function chartOf(item: Locator) {
  await item.evaluate((e) =>
    e
      .closest('.chart-legend')
      ?.parentElement?.setAttribute('data-legend-chart', ''),
  )
  const chart = item.page().locator('[data-legend-chart]')
  await expect(chart.locator(SERIES).first()).toBeAttached()
  return chart
}

async function finishedOnboarding(page: Page) {
  return await page.evaluate(
    () => localStorage.getItem('has-finished-legend-onboarding') === 'true',
  )
}
