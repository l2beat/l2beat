import { expect, test } from 'playwright/test'

/**
 * A chart keeps its last settled size until its box stops moving, so the box
 * must be able to shrink below that size. On the liquid-staking page, two
 * charts share a grid row on wide screens; narrowing the window from there to
 * a phone's width once left both at their wide size, and the page scrolled
 * sideways by over 500 px. This loads the page wide, narrows the window and
 * waits for the page to fit it again.
 */
const PAGE = '/defi/liquid-staking'
const WIDE = { width: 1024, height: 900 }
const PHONE = { width: 414, height: 840 }

test('charts shrink when the window narrows', async ({ page }) => {
  await page.setViewportSize(WIDE)
  await page.goto(PAGE)
  await expect(page.locator('.ts-chart-host svg').first()).toBeVisible()

  await page.setViewportSize(PHONE)

  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(PHONE.width)
})
