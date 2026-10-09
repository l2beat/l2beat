import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type Browser,
  type CDPSession,
  expect,
  type Page,
  test,
} from 'playwright/test'

/**
 * Ratchet for watching /blobs live: the belt, the stats and the posters
 * table animate on every frame and again as each block lands, so the work
 * of a slot gets a ceiling that only moves down.
 *
 * A watch is one whole slot, from just after it starts, so it holds exactly
 * one block landing whatever the clock. Mock mode's beacon node makes each
 * slot's block from its number, so the data is fixed too; what still varies
 * is which slot, and with it how many batches land, which is why the best of
 * a few watches counts and the margins are wide. A slot whose block was
 * missed, as mock mode misses one in 40, lands nothing and would be the best
 * by far, so it is watched past rather than counted.
 *
 * The main proxy is how many elements the browser restyles: a DOM write that
 * dirties the whole page shows up as millions per slot, where local ones add
 * up to thousands, and it does not depend on the machine's speed. Quiet
 * paints catch what restyles miss: one element changed on every frame
 * restyles almost nothing, yet repaints and re-layers the page around it each
 * time, which on a phone is most of a frame. They are counted per second
 * over the longest stretch the belt holds still, after every landing has
 * played out, so how big the block was does not move them. Layouts and belt
 * repaints come with them; the belt has nothing to repaint for most of a
 * slot. Script time is kept with wide headroom only, as it varies by machine;
 * slow frames are logged, not asserted, for the same reason.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margins below.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const SLOT_MS = 12_000
const GENESIS_MS = 1606824023_000
/** Before the slot's block comes in, which mock mode has two seconds in */
const START_INTO_SLOT_MS = 500
const WATCHES = 3
/** Watches allowed beyond `WATCHES` for slots that turn out missed */
const SPARE_WATCHES = 2
/**
 * A belt that holds still this long had no block to drop: one that lands
 * keeps it moving from two seconds in until its labels fade, seven at most
 */
const STILL_WHEN_MISSED_MS = 9_000

const MARGIN = {
  restyledElements: (n: number) => n * 2,
  quietPaintsPerSecond: (n: number) => n * 2,
  layouts: (n: number) => Math.ceil(n * 1.5),
  beltPaints: (n: number) => Math.ceil(n * 1.25),
  scriptMs: (n: number) => n * 4,
}

type Measurement = {
  restyledElements: number
  quietPaintsPerSecond: number
  layouts: number
  beltPaints: number
  scriptMs: number
  framesOverBudget: number
  maxFrameMs: number
}
type Ceilings = Record<string, Pick<Measurement, keyof typeof MARGIN>>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const viewport of Object.keys(ceilings)) {
  test(`watching /blobs at ${viewport} stays under its ceiling`, async ({
    browser,
  }) => {
    // Up to a slot to reach the first watch, then two slots each: a watch
    // ends half a second into the next slot, too late to start on it
    test.setTimeout((1 + 2 * (WATCHES + SPARE_WATCHES)) * SLOT_MS + 30_000)
    const [width, height] = viewport.split('x').map(Number)
    const { page, cdp, close } = await openBlobs(browser, width!, height!)

    const runs: Measurement[] = []
    for (
      let watch = 0;
      watch < WATCHES + SPARE_WATCHES && runs.length < WATCHES;
      watch++
    ) {
      const run = await watchOneSlot(page, cdp, browser)
      if (run) runs.push(run)
    }
    expect(runs, 'watches with a block landing').toHaveLength(WATCHES)
    await close()

    const result = bestOf(runs)
    measured[viewport] = result
    console.log(viewport, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    const ceiling = ceilings[viewport]
    for (const key of Object.keys(MARGIN) as (keyof typeof MARGIN)[]) {
      expect(result[key], `${key} at ${viewport}`).toBeLessThanOrEqual(
        ceiling![key],
      )
    }
  })
}

// As in resize-perf: merged and clamped, so a noisy run cannot raise a ceiling
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [viewport, result] of Object.entries(measured)) {
    const existing = ceilings[viewport]
    next[viewport] = Object.fromEntries(
      (Object.keys(MARGIN) as (keyof typeof MARGIN)[]).map((key) => [
        key,
        lowerOf(existing?.[key], MARGIN[key](result[key])),
      ]),
    ) as Ceilings[string]
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

/** /blobs scrolled to the belt, as a visitor watches it, once it is live */
async function openBlobs(browser: Browser, width: number, height: number) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  await page.addInitScript(countBeltPaints)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Performance.enable')
  await page.goto('/blobs', { waitUntil: 'load' })
  await page.addStyleTag({ content: STOP_LIVE_PING })
  await page.locator('canvas[role=img]').scrollIntoViewIfNeeded()
  await page.getByRole('status').getByText('Live').waitFor()
  await page.evaluate(installFrameProbe)
  return { page, cdp, close: () => context.close() }
}

/** What a slot cost to watch, or undefined if its block was missed */
async function watchOneSlot(
  page: Page,
  cdp: CDPSession,
  browser: Browser,
): Promise<Measurement | undefined> {
  await page.waitForTimeout(untilNextSlotMs() + START_INTO_SLOT_MS)
  await page.evaluate(resetProbes)
  const before = await metrics(cdp)
  await browser.startTracing(page, {
    categories: [
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'blink.user_timing',
    ],
  })
  await page.waitForTimeout(SLOT_MS)
  const trace = await browser.stopTracing()
  const after = await metrics(cdp)
  const probes = (await page.evaluate(readProbes)) as Pick<
    Measurement,
    'beltPaints' | 'framesOverBudget' | 'maxFrameMs'
  >
  const events = traceEvents(trace)
  const still = longestBeltStill(events)
  if (!still || still.to - still.from > STILL_WHEN_MISSED_MS * 1000) {
    return undefined
  }
  return {
    restyledElements: countRestyledElements(events),
    quietPaintsPerSecond: paintsPerSecond(events, still),
    layouts: after.LayoutCount - before.LayoutCount,
    scriptMs: Math.round((after.ScriptDuration - before.ScriptDuration) * 1000),
    ...probes,
  }
}

function untilNextSlotMs() {
  const intoSlot = (Date.now() - GENESIS_MS) % SLOT_MS
  return SLOT_MS - intoSlot
}

interface TraceEvent {
  name: string
  ph: string
  /** Microseconds */
  ts: number
  args?: { elementCount?: number }
}

function traceEvents(trace: Buffer): TraceEvent[] {
  const parsed = JSON.parse(trace.toString('utf8'))
  return Array.isArray(parsed) ? parsed : parsed.traceEvents
}

/** Elements each style recalculation went through, summed over the trace */
function countRestyledElements(events: TraceEvent[]) {
  let restyled = 0
  for (const event of events) {
    if (event.name === 'UpdateLayoutTree' && event.ph === 'X') {
      restyled += event.args?.elementCount ?? 0
    }
  }
  return restyled
}

/**
 * The longest gap from one belt paint to the next, in trace microseconds;
 * undefined if the belt painted less than twice, so held still throughout
 */
function longestBeltStill(events: TraceEvent[]) {
  const paints = events
    .filter((e) => e.name === BELT_PAINT_MARK)
    .map((e) => e.ts)
    .sort((a, b) => a - b)
  let still: { from: number; to: number } | undefined
  for (let i = 1; i < paints.length; i++) {
    if (!still || paints[i]! - paints[i - 1]! > still.to - still.from) {
      still = { from: paints[i - 1]!, to: paints[i]! }
    }
  }
  return still
}

function paintsPerSecond(
  events: TraceEvent[],
  { from, to }: { from: number; to: number },
) {
  let paints = 0
  for (const event of events) {
    const within = event.ts > from && event.ts < to
    if (within && event.name === 'Paint' && event.ph === 'X') paints++
  }
  return Math.round(paints / ((to - from) / 1e6))
}

function bestOf(runs: Measurement[]): Measurement {
  const best = { ...runs[0]! }
  for (const key of Object.keys(best) as (keyof Measurement)[]) {
    best[key] = Math.min(...runs.map((r) => r[key]))
  }
  return best
}

function lowerOf(existing: number | undefined, measured: number) {
  return existing === undefined ? measured : Math.min(existing, measured)
}

async function metrics(cdp: CDPSession) {
  const { metrics } = await cdp.send('Performance.getMetrics')
  const byName = Object.fromEntries(metrics.map((m) => [m.name, m.value]))
  return {
    LayoutCount: byName.LayoutCount ?? 0,
    ScriptDuration: byName.ScriptDuration ?? 0,
  }
}

// Strings rather than closures: tsx injects a __name helper the page lacks.

// Headless Chromium runs even an opacity-only CSS animation on the main
// thread, so the LIVE dot's ping would restyle and paint every frame and hide
// any other per-frame cost; a browser with a GPU runs it on the compositor
const STOP_LIVE_PING = '.animate-ping { animation: none !important; }'

// The belt clears its canvas once for every frame it paints; the mark puts
// that frame on the trace's clock
const BELT_PAINT_MARK = 'belt-paint'
const countBeltPaints = `(() => {
  window.__beltPaints = 0
  const clearRect = CanvasRenderingContext2D.prototype.clearRect
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    if (this.canvas.isConnected) {
      window.__beltPaints++
      performance.mark('${BELT_PAINT_MARK}')
    }
    return clearRect.apply(this, args)
  }
})()`

const installFrameProbe = `(() => {
  const w = window
  w.__frameGaps = []
  let last = performance.now()
  const loop = (now) => {
    w.__frameGaps.push(now - last)
    last = now
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
})()`

const resetProbes = `(() => {
  window.__frameGaps = []
  window.__beltPaints = 0
  performance.clearMarks('${BELT_PAINT_MARK}')
})()`

// Over budget at 60 Hz, with a little slack for timer jitter
const readProbes = `(() => {
  const gaps = window.__frameGaps
  return {
    beltPaints: window.__beltPaints,
    framesOverBudget: gaps.filter((g) => g > 20).length,
    maxFrameMs: Math.round(Math.max(...gaps)),
  }
})()`
