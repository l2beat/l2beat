import type { Locator } from 'playwright/test'
import { beltTileShare, expect, test } from './blobsPage'
import { findLayoutFaults } from './layoutFaults'

/**
 * What a desktop browser can do to the page that a phone cannot: be any
 * width, and be resized while open. Also how the page holds up when its feed
 * fails, the theme changes, or motion is turned down, which needs only one
 * screen to check.
 */
test.describe.configure({ mode: 'parallel' })

test.beforeEach(({ isMobile }) => {
  test.skip(isMobile, 'A desktop browser alone resizes freely')
})

/**
 * Every 16 px from the narrowest phone to a wide monitor, and either side of
 * each breakpoint, where layouts change and faults most often hide
 */
const WIDTHS = [
  ...Array.from({ length: (1920 - 320) / 16 + 1 }, (_, i) => 320 + i * 16),
  ...[549, 550, 767, 768, 1199, 1200, 1439, 1440],
].sort((a, b) => a - b)

test('lays out well at every width', async ({ blobs, page }) => {
  test.setTimeout(120_000)
  await blobs.openLive()
  await blobs.posters.scrollIntoViewIfNeeded()
  await expect(blobs.posterRows.first()).toBeVisible()

  const faults = new Map<string, number[]>()
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 1000 })
    // for the resize observers, and the charts they redraw; a fault shown
    // for a frame as a width is crossed is not one a reader sees
    await page.waitForTimeout(100)
    for (const fault of await findLayoutFaults(page)) {
      faults.set(fault, [...(faults.get(fault) ?? []), width])
    }
  }
  const report = [...faults].map(
    ([fault, widths]) => `${fault} at ${widths.join(', ')}px`,
  )
  expect(report).toEqual([])
})

test('fits the window again after it is made narrower', async ({
  blobs,
  page,
}) => {
  await blobs.openLive()
  // narrower with the side menu still shown, and down past it and back
  for (const width of [1210, 1100, 1300]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.waitForTimeout(500)
    expect(await findLayoutFaults(page), `at ${width}px`).toEqual([])
  }
})

test('waits for the feed while it fails, then goes live', async ({
  blobs,
  page,
}) => {
  let failing = true
  await page.route('**/api/trpc/da.liveBlobs**', (route) =>
    failing ? route.fulfill({ status: 500, body: 'down' }) : route.continue(),
  )
  await blobs.open()
  await blobs.belt.scrollIntoViewIfNeeded()
  await page.waitForTimeout(3_000)
  await expect(blobs.status).toContainText('Connecting to Ethereum…')
  await expect(page.getByText('The blocks could not be drawn')).toBeHidden()

  failing = false
  // a failed ask is retried after 4 s, then 8 s, 16 s and 30 s
  await expect(blobs.status).toContainText('Live', { timeout: 35_000 })
  await expect(blobs.shareStrip).toBeVisible()
  await expect(blobs.posterRows.first()).toBeVisible()
})

test('repaints the belt in the theme it is switched to', async ({ blobs }) => {
  await blobs.openLive()
  await blobs.page.waitForTimeout(1_000)
  const light = await beltInk(blobs.belt)
  await blobs.page.evaluate(() =>
    document.documentElement.classList.add('dark'),
  )
  await expect.poll(() => beltInk(blobs.belt)).not.toBe(light)
})

test('fills in the belt and the numbers with motion turned down', async ({
  blobs,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await blobs.openLive()
  await expect.poll(() => beltTileShare(blobs.belt)).toBeGreaterThan(0.02)
  await expect(blobs.liveCard.locator('dd').first()).toHaveText(/^[\d,]+$/)
  await expect(blobs.shareStrip).toBeVisible()
})

/** How bright the belt is drawn, on average over its pixels */
function beltInk(belt: Locator) {
  return belt.evaluate((element) => {
    const canvas = element as HTMLCanvasElement
    const { data } = canvas
      .getContext('2d')!
      .getImageData(0, 0, canvas.width, canvas.height)
    let sum = 0
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i]! + data[i + 1]! + data[i + 2]!) * (data[i + 3]! / 255)
    }
    return Math.round(sum / (data.length / 4))
  })
}
