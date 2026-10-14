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
 * as WebKit has no layout counter to read. The time is taken against a
 * control: a plain table of as many rows, added to the page unseen and
 * changed the same way, so what gets ratcheted is how many times costlier a
 * posters row is to lay out than a plain one. A slow runner slows both, and
 * CI runners differ by up to 4x; the ratio moves only with the page. The
 * margin is still wide, as the regressions this catches cost ten times as
 * much, not ten percent.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margin below.
 */
test.use({ browserName: 'webkit' })

const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const SAMPLES = 5
/**
 * A sample changes the number until this long has passed: WebKit rounds
 * performance.now() to the millisecond, and a plain row takes microseconds
 */
const SAMPLE_MS = 50

const MARGIN = {
  layoutCostOverPlain: (ratio: number) => Math.ceil(ratio * 2),
}

/** Both logged; only the ratio is ratcheted */
type Measurement = { layoutMsPerChange: number; layoutCostOverPlain: number }
type Ceilings = Record<string, Pick<Measurement, keyof typeof MARGIN>>

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
      `(${measureLayoutOverPlain})(${JSON.stringify(TABLE_NUMBER)}, ${JSON.stringify(TABLE_ROW)}, ${SAMPLES}, ${SAMPLE_MS})`,
    )) as Measurement
    await context.close()
    measured[viewport] = result
    console.log(viewport, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    expect(
      result.layoutCostOverPlain,
      `layoutCostOverPlain at ${viewport}`,
    ).toBeLessThanOrEqual(ceilings[viewport]!.layoutCostOverPlain)
  })
}

// As in resize-perf: merged and clamped, so a noisy run cannot raise a ceiling
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [viewport, result] of Object.entries(measured)) {
    next[viewport] = {
      layoutCostOverPlain: lowerOf(
        ceilings[viewport]?.layoutCostOverPlain,
        MARGIN.layoutCostOverPlain(result.layoutCostOverPlain),
      ),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

/** A RollingNumber in a posters row, which counts as its poster's blobs land */
const TABLE_NUMBER = '#live-posters [data-flip-key] span.tabular-nums'
const TABLE_ROW = '#live-posters [data-flip-key]'
/** Cells in a row of the plain control table: about as many as a posters row */
const PLAIN_CELLS = 8

// A string, as tsx injects a helper the page lacks into closures
const measureLayoutOverPlain = `(numberSelector, rowSelector, samples, sampleMs) => {
  const timeChanges = (text) => {
    const shown = text.data
    const counted = shown.replace(/\\d/, (digit) => String((Number(digit) + 1) % 10))
    let best = Number.POSITIVE_INFINITY
    for (let sample = 0; sample < samples; sample++) {
      const start = performance.now()
      let changes = 0
      let elapsed = 0
      do {
        text.data = changes % 2 === 0 ? counted : shown
        document.documentElement.offsetHeight
        changes++
        elapsed = performance.now() - start
      } while (elapsed < sampleMs)
      best = Math.min(best, elapsed / changes)
    }
    text.data = shown
    return best
  }

  const number = [...document.querySelectorAll(numberSelector)].find((element) =>
    /\\d/.test(element.textContent ?? ''),
  )
  const rows = document.querySelectorAll(rowSelector).length
  // In the flow, hidden: WebKit skips laying out a table taken out of the flow
  const plain = document.createElement('table')
  plain.style.visibility = 'hidden'
  plain.innerHTML = Array.from({ length: rows }, (_, row) =>
    '<tr>' + Array.from({ length: ${PLAIN_CELLS} }, (_, cell) => '<td>' + (row * 7 + cell) + '</td>').join('') + '</tr>',
  ).join('')
  document.body.append(plain)
  document.documentElement.offsetHeight

  const table = timeChanges(number.firstChild)
  const control = timeChanges(plain.querySelector('td').firstChild)
  plain.remove()
  return {
    layoutMsPerChange: Math.round(table * 100) / 100,
    layoutCostOverPlain: Math.round((table / control) * 10) / 10,
  }
}`
