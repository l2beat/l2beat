import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'playwright/test'
import { lowerOf } from '../blobs-perf/blobsPage'

/**
 * Ratchet for Safari animating /blobs as a block lands. A number counting up
 * glows by animating its color, which runs on the main thread, and while any
 * such animation runs WebKit goes through every element that is a layer of
 * its own on each frame. Were each Activity bar scaled and dimmed by its own
 * style, ~1,700 of them, that would cost 2 ms of style a frame on a Mac, and in
 * the iOS Simulator push most frames of a drop past the 8.3 ms of a 120 Hz screen.
 *
 * Method: count the elements on the page with a transform or an opacity
 * under 1, either of which makes an element a layer of its own. A count, as
 * it does not depend on the machine; the cost per layer does.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * layerCeilings.json from the current run plus the margin below.
 */
test.use({ browserName: 'webkit' })

const CEILINGS_FILE = join(__dirname, 'layerCeilings.json')

// a block landing adds rows to the posters table, and each row a few layers
const MARGIN = {
  ownLayers: (n: number) => Math.ceil(n * 1.5),
}

type Measurement = { ownLayers: number }
type Ceilings = Record<string, Measurement>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const viewport of Object.keys(ceilings)) {
  test(`/blobs at ${viewport} keeps its own layers under the ceiling`, async ({
    browser,
  }) => {
    const [width, height] = viewport.split('x').map(Number)
    const context = await browser.newContext({
      viewport: { width: width!, height: height! },
    })
    const page = await context.newPage()
    await page.goto('/blobs', { waitUntil: 'load' })
    await page.locator('#live-posters [data-flip-key]').first().waitFor()

    const result = (await page.evaluate(countOwnLayers)) as Measurement
    await context.close()
    measured[viewport] = result
    console.log(viewport, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    expect(result.ownLayers, `ownLayers at ${viewport}`).toBeLessThanOrEqual(
      ceilings[viewport]!.ownLayers,
    )
  })
}

// As in resize-perf: merged and clamped, so a noisy run cannot raise a ceiling
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [viewport, result] of Object.entries(measured)) {
    next[viewport] = {
      ownLayers: lowerOf(
        ceilings[viewport]?.ownLayers,
        MARGIN.ownLayers(result.ownLayers),
      ),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

// A string, as tsx injects a helper the page lacks into closures. Only what is
// rendered: an element with no boxes makes no layer
const countOwnLayers = `(() => {
  let ownLayers = 0
  for (const element of document.querySelectorAll('body *')) {
    if (element.getClientRects().length === 0) continue
    const style = getComputedStyle(element)
    if (style.transform !== 'none' || style.opacity !== '1') ownLayers++
  }
  return { ownLayers }
})()`
