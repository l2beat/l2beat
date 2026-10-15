import { expect, type Page, test } from 'playwright/test'

/**
 * Project sections skip rendering while off screen (see LazyHydrate), which
 * clips whatever overflows a section. The value chart is the last thing in
 * its section and both its tooltips open downwards, so this checks each
 * tooltip is what the page shows at its own bottom edge.
 */
const PAGE = '/privacy/projects/privacy-pools'
const SECTION = '#privacy-tvl'
const DESKTOP = { width: 1400, height: 900 }
const MILESTONE_TOOLTIP = '[data-radix-popper-content-wrapper]'
const CHART_TOOLTIP = '.recharts-tooltip-wrapper'

test('chart milestone tooltip shows past the bottom of its section', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()
  await page.goto(`${PAGE}${SECTION}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const marker = page
    .locator(`${SECTION} [data-role="milestones"] > div`)
    .first()
  await marker.scrollIntoViewIfNeeded()
  await marker.hover()
  await expectShownPastSection(page, MILESTONE_TOOLTIP)
  await context.close()
})

test('chart tooltip shows past the bottom of its section', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()
  await page.goto(`${PAGE}${SECTION}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const plot = page.locator(`${SECTION} .recharts-cartesian-grid`).first()
  await plot.scrollIntoViewIfNeeded()
  const plotBox = await plot.boundingBox()
  if (!plotBox) throw new Error('Plot not rendered')
  // The tooltip opens below the pointer, so the lower the pointer, the
  // further the tooltip reaches past the chart
  await page.mouse.move(
    plotBox.x + plotBox.width / 4,
    plotBox.y + plotBox.height - 5,
  )
  await expectShownPastSection(page, CHART_TOOLTIP)
  await context.close()
})

async function expectShownPastSection(page: Page, tooltipSelector: string) {
  const tooltip = page.locator(`${SECTION} ${tooltipSelector}`)
  await expect(tooltip).toBeVisible()
  // Let the tooltip finish moving or zooming in before measuring it
  await page.waitForTimeout(300)

  const tooltipBox = await tooltip.boundingBox()
  const sectionBox = await page.locator(SECTION).boundingBox()
  if (!tooltipBox || !sectionBox) throw new Error('Box not rendered')
  // A few pixels in from the edge, so the point is still on the tooltip
  const bottom = tooltipBox.y + tooltipBox.height - 4
  expect(bottom).toBeGreaterThan(sectionBox.y + sectionBox.height)

  // elementFromPoint skips the Recharts tooltip, which ignores the pointer
  const isTooltipOnTop = await tooltip.evaluate(
    (element: HTMLElement, { x, y }) => {
      element.style.pointerEvents = 'auto'
      const isOnTop = element.contains(document.elementFromPoint(x, y))
      element.style.pointerEvents = ''
      return isOnTop
    },
    { x: tooltipBox.x + tooltipBox.width / 2, y: bottom },
  )
  expect(isTooltipOnTop).toEqual(true)
}
