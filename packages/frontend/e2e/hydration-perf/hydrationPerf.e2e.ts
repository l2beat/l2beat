import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { type BrowserContext, expect, test } from 'playwright/test'

/**
 * Ratchet for loading a page: every page gets a ceiling on the layouts and
 * style recalculations it costs from navigation until it settles (hydrated,
 * charts mounted), and the ceiling only moves down.
 *
 * Both counts are the proxy for main-thread time after the page appears,
 * which is what makes it slow to answer the first click, sort or filter.
 * The regressions it guards against show up as counts: measuring in the DOM
 * during hydration (each read forces a layout), or writing styles that the
 * whole document has to recompute, as next-themes did on every load by
 * adding and then removing a stylesheet.
 *
 * The page loads with a warm HTTP cache, as when navigating between pages,
 * twice, and the lower count counts. Long-task time is logged, not asserted,
 * as it varies with the runner's CPU (see ../README.md).
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margins below.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const LOADS = 2
const QUIET_MS = 2000
const MAX_WAIT_MS = 15000
// Both counts move by up to a tenth between loads of the same build, with
// how many frames the chart entrance animations get, and a page with few
// layouts (risk: 6 to 8) by a couple either way. The project page's ceiling
// is set by hand to twice its usual count: the mock data behind it changes
// on every request, and so do the sections it lays out.
const MARGIN = {
  layouts: (n: number) => Math.max(Math.ceil(n * 1.25), n + 3),
  styleRecalcs: (n: number) => Math.max(Math.ceil(n * 1.25), n + 3),
}

type Measurement = {
  layouts: number
  styleRecalcs: number
  longTaskMs: number
  longestTaskMs: number
}
type Ceilings = Record<string, Pick<Measurement, keyof typeof MARGIN>>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const path of Object.keys(ceilings)) {
  test(`loading ${path} stays under its ceiling`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
    })
    const warm = await context.newPage()
    await warm.goto(path, { waitUntil: 'load' })
    await warm.close()

    const runs: Measurement[] = []
    for (let load = 0; load < LOADS; load++) {
      runs.push(await measureLoad(context, path))
    }
    await context.close()

    const result = bestOf(runs)
    measured[path] = result
    console.log(path, JSON.stringify(result))

    if (process.env.UPDATE_CEILINGS) return
    const ceiling = ceilings[path]
    expect(ceiling).toBeDefined()
    for (const key of Object.keys(MARGIN) as (keyof typeof MARGIN)[]) {
      expect(result[key], `${key} on ${path}`).toBeLessThanOrEqual(
        ceiling![key],
      )
    }
  })
}

// Merged into the file, so a filtered or interrupted run cannot drop a page,
// and clamped to the existing ceiling, so a noisy run cannot raise one. A
// ceiling that has to go up (a new page, an accepted regression) is edited
// by hand.
test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [path, result] of Object.entries(measured)) {
    const existing = ceilings[path]
    next[path] = {
      layouts: lowerOf(existing?.layouts, MARGIN.layouts(result.layouts)),
      styleRecalcs: lowerOf(
        existing?.styleRecalcs,
        MARGIN.styleRecalcs(result.styleRecalcs),
      ),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

async function measureLoad(
  context: BrowserContext,
  path: string,
): Promise<Measurement> {
  const page = await context.newPage()
  await page.addInitScript(collectLongTasks)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Performance.enable')
  const response = await page.goto(path, { waitUntil: 'load' })
  // An error page would measure low and could lower a ceiling.
  expect(response?.ok(), `navigation to ${path}`).toBe(true)
  await waitUntilQuiet(() => page.evaluate(countActivity))

  const { metrics } = await cdp.send('Performance.getMetrics')
  const byName = Object.fromEntries(metrics.map((m) => [m.name, m.value]))
  const tasks = (await page.evaluate(readLongTasks)) as number[]
  await page.close()
  return {
    layouts: byName.LayoutCount ?? 0,
    styleRecalcs: byName.RecalcStyleCount ?? 0,
    longTaskMs: tasks.reduce((sum, duration) => sum + duration, 0),
    longestTaskMs: Math.max(0, ...tasks),
  }
}

/** Settled once neither long tasks nor DOM changes happen for a while. */
async function waitUntilQuiet(countActivity: () => Promise<number>) {
  const start = Date.now()
  let last = -1
  let quietSince = Date.now()
  while (Date.now() - start < MAX_WAIT_MS) {
    const count = await countActivity()
    if (count !== last) {
      last = count
      quietSince = Date.now()
    } else if (Date.now() - quietSince >= QUIET_MS) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  // Counted past this point, work that never settles would slip under the
  // ceiling.
  throw new Error('Page did not settle', { cause: { maxWaitMs: MAX_WAIT_MS } })
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

// Strings rather than closures: tsx injects a __name helper the page lacks.
const collectLongTasks = `(() => {
  window.__longTasks = []
  window.__mutations = 0
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__longTasks.push(Math.round(entry.duration))
  }).observe({ type: 'longtask', buffered: true })
  document.addEventListener('DOMContentLoaded', () => {
    new MutationObserver((records) => { window.__mutations += records.length })
      .observe(document.body, { subtree: true, childList: true, attributes: true })
  })
})()`

const countActivity = 'window.__longTasks.length + window.__mutations'

const readLongTasks = 'window.__longTasks'
