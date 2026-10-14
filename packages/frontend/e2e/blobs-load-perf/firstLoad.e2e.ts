import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { type Browser, expect, type Page, test } from 'playwright/test'
import {
  bestOf,
  countRestyledElements,
  lowerOf,
  type TraceEvent,
  traceEvents,
} from '../blobs-perf/blobsPage'

/**
 * Ratchet for opening /blobs on a phone, from the first live answer to the
 * belt showing its blocks under a status that reads Live.
 *
 * Why this span: on a phone it is most of the page's own time. On a
 * mid-range phone's CPU the answer comes about 1.1 s after navigation, and
 * whatever is built in the same task delays the first look at the belt. The
 * posters table, thousands of elements far below the belt, once took 1.3 s
 * there.
 *
 * Method: hold the first answer until the page is idle, so it never races
 * hydration or the charts' answers, then release it and trace until the frame
 * after the belt and the status are in. Counts are the proxy, being stable
 * across machines: elements restyled and objects laid out in that span, the
 * best of a few loads. In mock mode the table's row count drifts a little
 * between loads, hence the margin.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margin below.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const LOADS = 3

const COUNTS = ['restyledElements', 'layoutObjects'] as const
const MARGIN = (n: number) => Math.ceil(n * 1.25)

type Measurement = Record<(typeof COUNTS)[number], number>
type Ceilings = Record<string, Measurement>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const viewport of Object.keys(ceilings)) {
  test(`opening /blobs at ${viewport} shows the live belt under its ceiling`, async ({
    browser,
  }) => {
    const [width, height] = viewport.split('x').map(Number)
    const runs: Measurement[] = []
    for (let load = 0; load < LOADS; load++) {
      const context = await browser.newContext({
        viewport: { width: width!, height: height! },
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true,
      })
      const page = await context.newPage()
      runs.push(await measureFirstAnswer(page, browser))
      await context.close()
    }

    const result = bestOf(runs)
    measured[viewport] = result
    console.log(viewport, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    for (const key of COUNTS) {
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
    const ceiling = (key: (typeof COUNTS)[number]) =>
      lowerOf(ceilings[viewport]?.[key], MARGIN(result[key]))
    next[viewport] = {
      restyledElements: ceiling('restyledElements'),
      layoutObjects: ceiling('layoutObjects'),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

async function measureFirstAnswer(
  page: Page,
  browser: Browser,
): Promise<Measurement> {
  const answer = holdFirstLiveAnswer(page)
  await page.addInitScript(watchForShownBelt)
  const charts = page.waitForResponse((r) => r.url().includes('tvs.chart'))
  await page.goto('/blobs', { waitUntil: 'load' })
  // the whole body, as tRPC streams a batch's answers after its headers
  await Promise.all([answer.held, charts.then((r) => r.finished())])
  await page.evaluate(UNTIL_IDLE)

  await browser.startTracing(page, {
    categories: [
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'blink.user_timing',
    ],
  })
  await page.evaluate(`performance.mark('${RELEASED_MARK}')`)
  answer.release()
  await page.waitForFunction('window.__beltShown')
  const events = inSpan(traceEvents(await browser.stopTracing()))
  return {
    restyledElements: countRestyledElements(events),
    layoutObjects: countLayoutObjects(events),
  }
}

/** Long polls after the first go straight through */
function holdFirstLiveAnswer(page: Page) {
  let release = () => {}
  let onHeld = () => {}
  const released = new Promise<void>((resolve) => {
    release = resolve
  })
  const held = new Promise<void>((resolve) => {
    onHeld = resolve
  })
  let first = true
  void page.route('**/da.liveBlobs**', async (route) => {
    if (first) {
      first = false
      onHeld()
      await released
    }
    await route.continue()
  })
  return { held, release }
}

// Twice, as the charts' answer schedules its render a task after it lands
const UNTIL_IDLE = `(async () => {
  for (let i = 0; i < 2; i++) {
    await new Promise((resolve) => requestIdleCallback(resolve, { timeout: 5000 }))
  }
})()`

const RELEASED_MARK = 'first-answer-released'
const SHOWN_MARK = 'belt-shown'

/** From the released answer to the frame after the belt is shown */
function inSpan(events: TraceEvent[]) {
  const markAt = (name: string) => events.find((e) => e.name === name)?.ts
  const from = markAt(RELEASED_MARK)
  const to = markAt(SHOWN_MARK)
  if (from === undefined || to === undefined) {
    throw new Error('Span marks missing from the trace', {
      cause: { from, to },
    })
  }
  return events.filter((e) => e.ts >= from && e.ts <= to)
}

type LayoutEvent = TraceEvent & {
  args?: { beginData?: { dirtyObjects?: number } }
}

function countLayoutObjects(events: LayoutEvent[]) {
  let objects = 0
  for (const event of events) {
    if (event.name === 'Layout' && event.ph === 'X') {
      objects += event.args?.beginData?.dirtyObjects ?? 0
    }
  }
  return objects
}

// A string, as tsx injects a helper the page lacks into closures. The belt
// has blocks once its description gives their average; a paint after that
// draws them, and the next frame comes once that one is on screen
const watchForShownBelt = `(() => {
  let paintedBlocks = false
  const clearRect = CanvasRenderingContext2D.prototype.clearRect
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    const label = this.canvas.getAttribute('aria-label') ?? ''
    if (this.canvas.isConnected && label.includes('on average')) {
      paintedBlocks = true
    }
    return clearRect.apply(this, args)
  }
  const watch = () => {
    const status = document.querySelector('[role=status]')?.textContent ?? ''
    if (paintedBlocks && status.includes('Live')) {
      performance.mark('${SHOWN_MARK}')
      window.__beltShown = true
      return
    }
    requestAnimationFrame(watch)
  }
  requestAnimationFrame(watch)
})()`
