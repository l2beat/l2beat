import { expect, type Page, test } from 'playwright/test'

/**
 * Chart tooltips follow the cursor and may leave their chart, but not the
 * window: past its right edge a tooltip also widens the page, which a phone
 * answers by zooming the whole page out. On a phone a full-width chart
 * leaves no room on either side of the cursor near its middle, so this
 * sweeps one across and watches every frame of each slide.
 */
const PAGE = '/scaling/summary'
const PHONE = { width: 390, height: 844 }
const STEPS = 16
/** Longer than recharts' 400ms slide from one point to the next. */
const SLIDE_MS = 500

test('chart tooltips stay inside a phone window', async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE })
  const page = await context.newPage()
  await page.goto(PAGE, { waitUntil: 'networkidle' })
  const chart = page.locator('.recharts-surface').first()
  await chart.scrollIntoViewIfNeeded()
  const box = await chart.boundingBox()
  expect(box).not.toBeNull()

  for (let step = 1; step < STEPS; step++) {
    const at = `${step}/${STEPS} across`
    await page.mouse.move(
      box!.x + (box!.width * step) / STEPS,
      box!.y + box!.height / 2,
    )
    const slide = await watchTooltip(page)
    expect(slide.shown, at).toBe(true)
    expect(slide.left, at).toBeGreaterThanOrEqual(0)
    expect(slide.right, at).toBeLessThanOrEqual(PHONE.width)
    expect(slide.pageWidth, at).toBe(PHONE.width)
  }
  await context.close()
})

/**
 * Below a chart lies the next section. A tooltip hanging over it stays there
 * after a tap while the page scrolls, and iOS Safari cuts it off at that
 * section's edge. The anonymity sets chart has the most series on the site,
 * so a tap halfway down it opens the tallest tooltip with the least room:
 * every row must still be in it, scrolled to rather than left out.
 */
test('a tapped chart tooltip stays inside its chart on a phone', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: PHONE,
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto('/privacy/projects/tornado-cash', {
    waitUntil: 'networkidle',
  })
  const section = page.locator('#privacy-anonymity-set')
  // Charts mount only once they near the viewport.
  await section.evaluate((e) => e.scrollIntoView({ block: 'end' }))
  const chart = section.locator('.recharts-wrapper').last()
  await chart.evaluate((e) => e.scrollIntoView({ block: 'center' }))
  await expect(chart.locator('.recharts-line-curve').first()).toBeVisible()

  // Charts ignore the pointer until the scroll settles, so tap until it shows.
  const tooltip = chart.locator('.recharts-tooltip-wrapper')
  await expect(async () => {
    const tapAt = await chart.boundingBox()
    await page.touchscreen.tap(
      tapAt!.x + tapAt!.width * 0.75,
      tapAt!.y + tapAt!.height / 2,
    )
    await expect(tooltip).toBeVisible({ timeout: 500 })
  }).toPass()
  const [chartBox, tooltipBox] = await Promise.all([
    chart.boundingBox(),
    tooltip.boundingBox(),
  ])
  const chartBottom = chartBox!.y + chartBox!.height
  expect(tooltipBox!.y).toBeGreaterThanOrEqual(chartBox!.y)
  expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(chartBottom)

  const lines = await chart.locator('.recharts-line').count()
  const rows = tooltip.locator('[class*="justify-between"]')
  await expect(rows).toHaveCount(lines)
  // Scroll to the last row.
  const scroller = tooltip.locator('.overflow-y-auto')
  await scroller.evaluate((e) => {
    e.scrollTop = e.scrollHeight
  })
  const lastRow = await rows.last().boundingBox()
  expect(lastRow!.y + lastRow!.height).toBeLessThanOrEqual(chartBottom)
  await context.close()
})

/** The tooltip's outermost edges and the page's width over one slide. */
async function watchTooltip(page: Page) {
  return await page.evaluate(
    (duration) =>
      new Promise<{
        shown: boolean
        left: number
        right: number
        pageWidth: number
      }>((resolve) => {
        const worst = { shown: false, left: 0, right: 0, pageWidth: 0 }
        const end = performance.now() + duration
        const frame = () => {
          const tooltip = document.querySelector('.recharts-tooltip-wrapper')
          if (tooltip && getComputedStyle(tooltip).visibility === 'visible') {
            const { left, right } = tooltip.getBoundingClientRect()
            worst.left = worst.shown ? Math.min(worst.left, left) : left
            worst.right = Math.max(worst.right, right)
            worst.shown = true
          }
          worst.pageWidth = Math.max(
            worst.pageWidth,
            document.documentElement.scrollWidth,
          )
          if (performance.now() < end) requestAnimationFrame(frame)
          else resolve(worst)
        }
        requestAnimationFrame(frame)
      }),
    SLIDE_MS,
  )
}
