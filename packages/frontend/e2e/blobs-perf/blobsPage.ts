import type { Browser, CDPSession } from 'playwright/test'

/**
 * What the /blobs ratchets share: the page opened at the belt once it is
 * live, the chain's clock, and the counts read from a trace.
 */

export const SLOT_MS = 12_000
const GENESIS_MS = 1606824023_000

/**
 * /blobs scrolled to the belt, as a visitor watches it, once it is live.
 * With `touch`, a phone's: a finger, not a mouse
 */
export async function openBlobs(
  browser: Browser,
  width: number,
  height: number,
  { touch = false } = {},
) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    hasTouch: touch,
    isMobile: touch,
  })
  const page = await context.newPage()
  await page.addInitScript(countBeltPaints)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Performance.enable')
  await page.goto('/blobs', { waitUntil: 'load' })
  await page.addStyleTag({ content: STOP_LIVE_PING })
  await page.locator('canvas[role=img]').scrollIntoViewIfNeeded()
  // the status itself, as it has a short and a long wording, one per width
  await page.getByRole('status').filter({ hasText: 'Live' }).waitFor()
  await page.evaluate(installFrameProbe)
  return { page, cdp, close: () => context.close() }
}

export function untilNextSlotMs() {
  const intoSlot = (Date.now() - GENESIS_MS) % SLOT_MS
  return SLOT_MS - intoSlot
}

export interface TraceEvent {
  name: string
  ph: string
  /** Microseconds */
  ts: number
  args?: { elementCount?: number }
}

export function traceEvents(trace: Buffer): TraceEvent[] {
  const parsed = JSON.parse(trace.toString('utf8'))
  return Array.isArray(parsed) ? parsed : parsed.traceEvents
}

/** Elements each style recalculation went through, summed over the trace */
export function countRestyledElements(events: TraceEvent[]) {
  let restyled = 0
  for (const event of events) {
    if (event.name === 'UpdateLayoutTree' && event.ph === 'X') {
      restyled += event.args?.elementCount ?? 0
    }
  }
  return restyled
}

export async function metrics(cdp: CDPSession) {
  const { metrics } = await cdp.send('Performance.getMetrics')
  const byName = Object.fromEntries(metrics.map((m) => [m.name, m.value]))
  return {
    LayoutCount: byName.LayoutCount ?? 0,
    ScriptDuration: byName.ScriptDuration ?? 0,
  }
}

/** Each count at its lowest over the runs, as the ratchet compares the best */
export function bestOf<T extends Record<string, number>>(runs: T[]): T {
  const [first] = runs
  if (!first) throw new Error('No runs to take the best of')
  const best = { ...first }
  for (const key of Object.keys(best) as (keyof T)[]) {
    best[key] = Math.min(...runs.map((r) => r[key])) as T[keyof T]
  }
  return best
}

export function lowerOf(existing: number | undefined, measured: number) {
  return existing === undefined ? measured : Math.min(existing, measured)
}

// Strings rather than closures: tsx injects a __name helper the page lacks.

// Headless Chromium runs even an opacity-only CSS animation on the main
// thread, so the LIVE dot's ping would restyle and paint every frame and hide
// any other per-frame cost; a browser with a GPU runs it on the compositor
const STOP_LIVE_PING = '.animate-ping { animation: none !important; }'

// The belt clears its canvas once for every frame it paints; the mark puts
// that frame on the trace's clock
export const BELT_PAINT_MARK = 'belt-paint'
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

export const resetProbes = `(() => {
  window.__frameGaps = []
  window.__beltPaints = 0
  performance.clearMarks('${BELT_PAINT_MARK}')
})()`

// Over budget at 60 Hz, with a little slack for timer jitter
export const readProbes = `(() => {
  const gaps = window.__frameGaps
  return {
    beltPaints: window.__beltPaints,
    framesOverBudget: gaps.filter((g) => g > 20).length,
    maxFrameMs: Math.round(Math.max(...gaps)),
  }
})()`
