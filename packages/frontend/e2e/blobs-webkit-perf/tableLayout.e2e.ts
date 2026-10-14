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
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margin below.
 */
test.use({ browserName: 'webkit' })

const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const SAMPLES = 5
const CHANGES_PER_SAMPLE = 20

const MARGIN = {
  layoutMsPerChange: (ms: number) => Math.ceil(ms * 8),
}

type Measurement = { layoutMsPerChange: number }
type Ceilings = Record<string, Measurement>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const viewport of Object.keys(ceilings)) {
  test(`a number counting in the /blobs table at ${viewport} stays under its ceiling`, async ({
    browser,
  }) => {
    const [width, height] = viewport.split('x').map(Number)
    const context = await browser.newContext({
      viewport: { width: width!, height: height! },
    })
    const page = await context.newPage()
    await page.goto('/blobs', { waitUntil: 'load' })
    await page.locator(TABLE_NUMBER).first().waitFor()

    const result = (await page.evaluate(
      `(${measureLayoutPerChange})(${JSON.stringify(TABLE_NUMBER)}, ${SAMPLES}, ${CHANGES_PER_SAMPLE})`,
    )) as Measurement
    await context.close()
    measured[viewport] = result
    console.log(viewport, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    expect(
      result.layoutMsPerChange,
      `layoutMsPerChange at ${viewport}`,
    ).toBeLessThanOrEqual(ceilings[viewport]!.layoutMsPerChange)
  })
}

// As in resize-perf: merged and clamped, so a noisy run cannot raise a ceiling
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [viewport, result] of Object.entries(measured)) {
    next[viewport] = {
      layoutMsPerChange: lowerOf(
        ceilings[viewport]?.layoutMsPerChange,
        MARGIN.layoutMsPerChange(result.layoutMsPerChange),
      ),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

/** A RollingNumber in a posters row, which counts as its poster's blobs land */
const TABLE_NUMBER = '#live-posters [data-flip-key] span.tabular-nums'

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
