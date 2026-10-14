import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type Browser,
  type CDPSession,
  expect,
  type Page,
  test,
} from 'playwright/test'
import {
  BELT_PAINT_MARK,
  bestOf,
  countRestyledElements,
  currentSlot,
  lowerOf,
  metrics,
  openBlobs,
  readProbes,
  resetProbes,
  rowsLandedBySlot,
  SLOT_MS,
  type TraceEvent,
  traceEvents,
  untilNextSlotMs,
} from './blobsPage'

/**
 * Ratchet for watching /blobs live: the belt, the stats and the posters
 * table animate on every frame and again as each block lands, so the work
 * of a slot gets a ceiling that only moves down.
 *
 * A watch is one whole slot, from just after it starts, so it holds exactly
 * one block landing whatever the clock. The watches run back to back in one
 * trace, split where each slot starts, as stopping one trace and starting
 * another would take long enough to miss the next slot's start. Mock mode's
 * beacon node makes each slot's block from its number, so the data is fixed
 * too; what still varies is which slot, and with it how much lands, which is
 * why the best of a few watches counts and the margins are wide. A slot whose
 * block was missed, as mock mode misses one in 40, lands nothing and would be
 * the best by far, so it is watched past rather than counted.
 *
 * The main proxy is how many elements the browser restyles: a DOM write that
 * dirties the whole page shows up as millions per slot, where local ones add
 * up to thousands, and it does not depend on the machine's speed. It is
 * counted per row of the posters table the block washed, as those rows are
 * most of it: a block of five posters restyles four times what a block of one
 * does, a swing no margin could hold. The rows come from the page's own feed.
 * Quiet paints catch what restyles miss: one element changed on every frame
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
  restyledPerRowLanded: (n: number) => n * 2,
  quietPaintsPerSecond: (n: number) => n * 2,
  // a few dozen, which swing by as many again run to run, where a layout on
  // every frame would add hundreds
  layouts: (n: number) => n * 2 + 30,
  beltPaints: (n: number) => Math.ceil(n * 1.25),
  scriptMs: (n: number) => n * 4,
}

type Measurement = {
  restyledPerRowLanded: number
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
    // A slot each, and up to a slot to reach the first; every spare may
    // need a trace of its own, which waits up to a slot to start too
    test.setTimeout((1 + WATCHES + 2 * SPARE_WATCHES) * SLOT_MS + 30_000)
    const [width, height] = viewport.split('x').map(Number)
    const { page, cdp, close } = await openBlobs(browser, width!, height!)

    const runs: Measurement[] = []
    let slotsLeft = WATCHES + SPARE_WATCHES
    while (runs.length < WATCHES && slotsLeft > 0) {
      const slots = Math.min(WATCHES - runs.length, slotsLeft)
      slotsLeft -= slots
      runs.push(...(await watchSlots(page, cdp, browser, slots)))
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

/**
 * What each of the next `slots` slots cost to watch, leaving out those whose
 * block was missed
 */
async function watchSlots(
  page: Page,
  cdp: CDPSession,
  browser: Browser,
  slots: number,
): Promise<Measurement[]> {
  await page.waitForTimeout(untilNextSlotMs() + START_INTO_SLOT_MS)
  await browser.startTracing(page, {
    categories: [
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'blink.user_timing',
    ],
  })
  const watched = [currentSlot()]
  const starts = [await markSlotStart(page, cdp)]
  for (let slot = 0; slot < slots; slot++) {
    await page.waitForTimeout(untilNextSlotMs() + START_INTO_SLOT_MS)
    watched.push(currentSlot())
    starts.push(await markSlotStart(page, cdp))
  }
  const events = traceEvents(await browser.stopTracing())
  const startTimes = events
    .filter((e) => e.name === SLOT_START_MARK)
    .map((e) => e.ts)
    .sort((a, b) => a - b)
  expect(startTimes, 'slot starts on the trace').toHaveLength(starts.length)

  const rowsLanded = await rowsLandedBySlot(page)
  const runs: Measurement[] = []
  for (let slot = 0; slot < slots; slot++) {
    const [from, to] = [startTimes[slot]!, startTimes[slot + 1]!]
    const inSlot = events.filter((e) => e.ts >= from && e.ts < to)
    const still = longestBeltStill(inSlot)
    if (!still || still.to - still.from > STILL_WHEN_MISSED_MS * 1000) continue
    const rows = rowsLanded.get(watched[slot]!) ?? 0
    if (rows === 0) continue
    const restyled = countRestyledElements(inSlot)
    console.log(
      `slot ${watched[slot]}: ${restyled} restyled, ${rows} rows landed`,
    )
    const [start, end] = [starts[slot]!, starts[slot + 1]!]
    runs.push({
      restyledPerRowLanded: Math.round(restyled / rows),
      quietPaintsPerSecond: paintsPerSecond(inSlot, still),
      layouts: end.counters.LayoutCount - start.counters.LayoutCount,
      scriptMs: Math.round(
        (end.counters.ScriptDuration - start.counters.ScriptDuration) * 1000,
      ),
      ...end.probes,
    })
  }
  return runs
}

/**
 * Marks where one watch ends and the next begins, on the trace, with the
 * counters then and what the probes saw since the last mark
 */
async function markSlotStart(page: Page, cdp: CDPSession) {
  const probes = (await page.evaluate(readProbesAndMarkSlot)) as Pick<
    Measurement,
    'beltPaints' | 'framesOverBudget' | 'maxFrameMs'
  >
  return { probes, counters: await metrics(cdp) }
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

const SLOT_START_MARK = 'slot-start'
// In one go, so no frame falls between two watches; a string, as tsx injects
// a helper the page lacks into closures
const readProbesAndMarkSlot = `(() => {
  const probes = ${readProbes};
  ${resetProbes};
  performance.mark('${SLOT_START_MARK}');
  return probes;
})()`
