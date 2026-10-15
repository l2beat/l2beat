import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'playwright/test'
import { lowerOf } from '../blobs-perf/blobsPage'

/**
 * Ratchet for Safari laying out /blobs while its numbers count. As a block
 * lands, the posters table counts up, writing new text on every frame, and
 * each write lays the page out again. Chromium lays out only what changed;
 * WebKit lays out the whole table, so a cell that is costly to lay out slows
 * every frame on an iPhone while the Chromium ratchets see nothing.
 *
 * Method: change one number in the table back and forth, forcing a layout
 * after each change, and time it, best of a few samples. Time, not a count,
 * as WebKit has no layout counter to read; the margin is wide because the
 * regressions this catches cost ten times as much, not ten percent, and
 * because CI runners differ: the same commit measures up to 4x slower on
 * some hosts than on others, and up to 5x slower than on a Mac.
 *
 * As a block lands, iOS Safari also repaints the rows it touches, painting
 * each box in a row on its own, so a row's boxes set what a landing costs
 * while the visitor swipes the belt. Desktop WebKit paints them cheaply and
 * shows no time to ratchet, so the boxes are counted instead: the HTML
 * elements in the fullest row, an SVG counting as one. Against the iOS
 * simulator, drawing the activity bars as one SVG took a row from 73 boxes to
 * 25, and the frames over 8.3 ms in a swipe across a landing from about 30 to
 * none.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margin below.
 */
test.use({ browserName: 'webkit' })

const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const SAMPLES = 5
const CHANGES_PER_SAMPLE = 20

const MARGIN = {
  layoutMsPerChange: (ms: number) => Math.ceil(ms * 8),
  // a count of what is rendered, the same on every run
  boxesPerRow: (boxes: number) => boxes,
}

type Measurement = { layoutMsPerChange: number; boxesPerRow: number }
type Ceilings = Record<string, Measurement>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const viewport of Object.keys(ceilings)) {
  test(`the /blobs table at ${viewport} stays under its ceilings`, async ({
    browser,
  }) => {
    const [width, height] = viewport.split('x').map(Number)
    const context = await browser.newContext({
      viewport: { width: width!, height: height! },
    })
    const page = await context.newPage()
    await page.goto('/blobs', { waitUntil: 'load' })
    await page.locator(TABLE_NUMBER).first().waitFor()

    const result: Measurement = {
      ...((await page.evaluate(
        `(${measureLayoutPerChange})(${JSON.stringify(TABLE_NUMBER)}, ${SAMPLES}, ${CHANGES_PER_SAMPLE})`,
      )) as Pick<Measurement, 'layoutMsPerChange'>),
      boxesPerRow: (await page.evaluate(
        `(${countBoxesPerRow})(${JSON.stringify(TABLE_ROW)})`,
      )) as number,
    }
    await context.close()
    measured[viewport] = result
    console.log(viewport, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    for (const key of Object.keys(MARGIN) as (keyof Measurement)[]) {
      expect(result[key], `${key} at ${viewport}`).toBeLessThanOrEqual(
        ceilings[viewport]![key],
      )
    }
  })
}

// As in resize-perf: merged and clamped, so a noisy run cannot raise a ceiling
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [viewport, result] of Object.entries(measured)) {
    next[viewport] = Object.fromEntries(
      (Object.keys(MARGIN) as (keyof Measurement)[]).map((key) => [
        key,
        lowerOf(ceilings[viewport]?.[key], MARGIN[key](result[key])),
      ]),
    ) as Measurement
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

/** A row of the posters table, one per project */
const TABLE_ROW = '#live-posters [data-flip-key]'
/** A RollingNumber in a posters row, which counts as its poster's blobs land */
const TABLE_NUMBER = `${TABLE_ROW} span.tabular-nums`

// A string, as tsx injects a helper the page lacks into closures. Many changes
// per sample, as WebKit rounds performance.now() to the millisecond
const measureLayoutPerChange = `(selector, samples, changes) => {
  const number = [...document.querySelectorAll(selector)].find((element) =>
    /\\d/.test(element.textContent ?? ''),
  )
  const text = number.firstChild
  const shown = text.data
  const counted = shown.replace(/\\d/, (digit) => String((Number(digit) + 1) % 10))
  let best = Number.POSITIVE_INFINITY
  for (let sample = 0; sample < samples; sample++) {
    const start = performance.now()
    for (let change = 0; change < changes; change++) {
      text.data = change % 2 === 0 ? counted : shown
      document.documentElement.offsetHeight
    }
    best = Math.min(best, (performance.now() - start) / changes)
  }
  text.data = shown
  return { layoutMsPerChange: Math.round(best * 10) / 10 }
}`

// Rows differ by what a project has, a link or a logo, so the fullest counts
const countBoxesPerRow = `(selector) => {
  const boxes = (row) =>
    [...row.querySelectorAll('*')].filter(
      (element) => !(element instanceof SVGElement) || element instanceof SVGSVGElement,
    ).length
  return Math.max(...[...document.querySelectorAll(selector)].map(boxes))
}`
