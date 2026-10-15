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
  bestOf,
  countRestyledElements,
  lowerOf,
  metrics,
  type TraceEvent,
  traceEvents,
} from '../blobs-perf/blobsPage'

/**
 * Ratchet for moving the token graph on a phone: one finger dragging it and
 * flinging it on, two pinching it, in the full-screen dialog that /tokens
 * opens. The graph is USDC's as production served it on 2026-10-15, the
 * busiest there is: 79 nodes, 37 relations.
 *
 * A frame of a gesture should only move two layers the browser already has
 * drawn, the diagram and its dot grid, and a fling should run on the
 * compositor alone. So what is counted is the work beyond that: React
 * commits, elements restyled, layouts and paints. A pinch draws the dot grid
 * on every frame, as its spacing follows the zoom, and the diagram each time
 * the zoom doubles or halves.
 *
 * When the diagram re-rendered on every move, a drag cost 168 commits, 84
 * layouts, 1,784 paints and 1.3 s of script in headless Chromium, and each
 * move 16-19 ms of script, style and layout in WebKit, past the 8.3 ms of a
 * 120 Hz frame. Moving the layers instead, the drag and its fling cost no
 * commits, 2 layouts, 4 paints and 0.18 s of script, and a move about nothing
 * in WebKit. Script time and the longest frame are logged, not asserted, as
 * they vary with the runner's CPU (see ../README.md).
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margins below.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')
/** On one line, as the response streams one JSON value a line */
const GRAPH = JSON.stringify(
  JSON.parse(readFileSync(join(__dirname, 'usdcGraph.json'), 'utf8')),
)
const RUNS = 3
const TOUCH_INTERVAL_MS = 1000 / 120

const MARGIN = {
  commits: (n: number) => n,
  // a finger moves once or twice a frame, so the restyles per move swing
  restyled: (n: number) => Math.ceil(n * 1.25),
  layouts: (n: number) => n,
  paints: (n: number) => n,
}

type Counts = Record<keyof typeof MARGIN, number>
type Measurement = Counts & { scriptMs: number; maxFrameMs: number }
type Ceilings = Record<string, Counts>
type Point = { x: number; y: number }
type Gesture = (cdp: CDPSession, center: Point) => Promise<void>

const GESTURES: Record<string, Gesture> = {
  'drag and fling': dragAndFling,
  pinch,
}

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const name of Object.keys(ceilings)) {
  const gesture = GESTURES[name]
  test(`a ${name} of the token graph stays under its ceiling`, async ({
    browser,
  }) => {
    // each traced run takes ~10 s on a runner, more for a regression
    test.setTimeout(120_000)
    expect(gesture, `a gesture named "${name}"`).toBeDefined()
    const { page, cdp, center, close } = await openGraph(browser)

    const runs: Measurement[] = []
    for (let run = 0; run < RUNS; run++) {
      runs.push(await measure(page, cdp, browser, () => gesture!(cdp, center)))
      await page.getByRole('button', { name: 'Reset view' }).tap()
    }
    await close()

    const result = bestOf(runs)
    measured[name] = result
    console.log(name, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    for (const key of Object.keys(MARGIN) as (keyof Counts)[]) {
      expect(result[key], `${key} for a ${name}`).toBeLessThanOrEqual(
        ceilings[name]![key],
      )
    }
  })
}

// As in resize-perf: merged and clamped, so a noisy run cannot raise a ceiling
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [name, result] of Object.entries(measured)) {
    next[name] = Object.fromEntries(
      (Object.keys(MARGIN) as (keyof Counts)[]).map((key) => [
        key,
        lowerOf(ceilings[name]?.[key], MARGIN[key](result[key])),
      ]),
    ) as Counts
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

/** /tokens on a phone, with USDC's graph open */
async function openGraph(browser: Browser) {
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.addInitScript(countCommits)
  // Mock mode's tokens have a few deployments each. The batch stream link
  // reads one JSON value a line: the response's head, then its result, data
  // and the graph, each in a slot of the one before.
  await page.route('**/api/trpc/tokens.relationsGraph**', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: [
        '{"0":[[0],[null,0,0]]}',
        '[0,0,[[{"result":0}],["result",0,1]]]',
        '[1,0,[[{"data":0}],["data",0,2]]]',
        `[2,0,[[${GRAPH}]]]`,
        '',
      ].join('\n'),
    }),
  )
  const cdp = await context.newCDPSession(page)
  await cdp.send('Performance.enable')
  await page.goto('/tokens', { waitUntil: 'load' })
  // a tap, as a click would leave the mouse hovering a node of the graph
  await page.getByRole('button', { name: /USDC/ }).first().tap()
  // the element that takes the gestures, as touch-action: none
  const diagram = page.getByRole('dialog').locator('.touch-none')
  await diagram.getByRole('button', { name: /USDC/ }).first().waitFor()
  await page.evaluate(PAUSE_SVG_ANIMATIONS)
  await page.evaluate(installFrameProbe)
  const box = await diagram.boundingBox()
  if (!box) throw new Error('The diagram is not on the page')
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  return { page, cdp, center, close: () => context.close() }
}

async function measure(
  page: Page,
  cdp: CDPSession,
  browser: Browser,
  gesture: () => Promise<void>,
): Promise<Measurement> {
  await page.evaluate(resetProbes)
  const before = await metrics(cdp)
  await browser.startTracing(page, {
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'],
  })
  await gesture()
  // past the end of a fling, and of the drawing that follows a pinch
  await page.waitForTimeout(1_500)
  const events = traceEvents(await browser.stopTracing())
  const after = await metrics(cdp)
  const probes = (await page.evaluate(readProbes)) as Pick<
    Measurement,
    'commits' | 'maxFrameMs'
  >
  return {
    commits: probes.commits,
    restyled: countRestyledElements(events),
    layouts: after.LayoutCount - before.LayoutCount,
    paints: countPaints(events),
    scriptMs: Math.round((after.ScriptDuration - before.ScriptDuration) * 1000),
    maxFrameMs: probes.maxFrameMs,
  }
}

/** One finger pans slowly, then flicks and lets go, which flings */
async function dragAndFling(cdp: CDPSession, center: Point) {
  const path = [
    ...line(center, { x: center.x - 120, y: center.y - 90 }, 40),
    ...line(
      { x: center.x - 120, y: center.y - 90 },
      { x: center.x + 40, y: center.y - 60 },
      40,
    ),
    ...line(
      { x: center.x + 40, y: center.y - 60 },
      { x: center.x - 160, y: center.y + 60 },
      5,
    ),
  ]
  const touch = touchscreen(cdp)
  await touch('touchStart', [center])
  for (const at of path) await touch('touchMove', [at])
  await touch('touchEnd', [])
}

/** Two fingers spread to four times as far apart, then pinch back */
async function pinch(cdp: CDPSession, center: Point) {
  const fingers = (spread: number) => [
    { x: center.x - spread, y: center.y - spread / 2 },
    { x: center.x + spread, y: center.y + spread / 2 },
  ]
  const steps = 45
  const touch = touchscreen(cdp)
  await touch('touchStart', fingers(30))
  for (let step = 1; step <= steps; step++) {
    await touch('touchMove', fingers(30 + (90 * step) / steps))
  }
  for (let step = 1; step <= steps; step++) {
    await touch('touchMove', fingers(120 - (90 * step) / steps))
  }
  await touch('touchEnd', [])
}

function line(from: Point, to: Point, steps: number): Point[] {
  return Array.from({ length: steps }, (_, step) => ({
    x: from.x + ((to.x - from.x) * (step + 1)) / steps,
    y: from.y + ((to.y - from.y) * (step + 1)) / steps,
  }))
}

/**
 * Sends touches stamped as a 120 Hz screen reports them, one every 8.3 ms,
 * however long the runner takes to send each. The speed a finger lets go
 * at, and so whether and how far it flings, is the same on every run
 */
function touchscreen(cdp: CDPSession) {
  const start = Date.now()
  let sent = 0
  return async (
    type: 'touchStart' | 'touchMove' | 'touchEnd',
    points: Point[],
  ) => {
    await cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: points.map((point, id) => ({ ...point, id })),
      timestamp: (start + sent++ * TOUCH_INTERVAL_MS) / 1000,
    })
  }
}

/** The layers of the page painted, summed over the trace */
function countPaints(events: TraceEvent[]) {
  return events.filter((event) => event.name === 'Paint' && event.ph === 'X')
    .length
}

// Strings rather than closures: tsx injects a __name helper the page lacks.

// React reports each commit to the DevTools hook, production builds too
const countCommits = `(() => {
  window.__commits = 0
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    renderers: new Map(),
    supportsFiber: true,
    inject: () => 1,
    onCommitFiberRoot: () => { window.__commits++ },
    onCommitFiberUnmount: () => {},
    onPostCommitFiberRoot: () => {},
    checkDCE: () => {},
  }
})()`

// The logo in the navbar beats for a second every five, laying out every
// frame of it, at a phase the gestures know nothing of
const PAUSE_SVG_ANIMATIONS = `document
  .querySelectorAll('svg')
  .forEach((svg) => svg.pauseAnimations())`

const installFrameProbe = `(() => {
  window.__frameGaps = []
  let last = performance.now()
  const loop = (now) => {
    window.__frameGaps.push(now - last)
    last = now
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
})()`

const resetProbes = `(() => {
  window.__frameGaps = []
  window.__commits = 0
})()`

const readProbes = `(() => ({
  commits: window.__commits,
  maxFrameMs: Math.round(Math.max(...window.__frameGaps)),
}))()`
