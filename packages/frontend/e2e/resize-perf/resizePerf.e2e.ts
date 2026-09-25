import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'playwright/test'

/**
 * Ratchet for drag-resizing the window: every page gets a ceiling on the
 * work one drag may cost, and the ceiling only moves down.
 *
 * The drag is 30 viewport steps issued as fast as the page can take them,
 * like a user pulling the window edge. Counts are the proxy because they are
 * stable across machines; script time is kept with wide headroom because the
 * regressions this catches (a sync React flush per resize listener, a chart
 * re-render per step) were ten times over it, not ten percent.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run plus the margins below.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const STEPS = 30
const FROM_WIDTH = 1400
const TO_WIDTH = 800
const HEIGHT = 900
// Layout counts swing by up to a fifth between runs of the same build, every
// chart may settle twice if a step stalls, and script time varies by machine.
const MARGIN = {
  layouts: (n: number) => Math.ceil(n * 1.25),
  chartRerenders: (n: number) => n * 2,
  scriptMs: (n: number) => n * 4,
}

type Measurement = {
  layouts: number
  chartRerenders: number
  scriptMs: number
  styleRecalcs: number
  framesOver50: number
  maxFrameMs: number
}
type Ceilings = Record<string, Pick<Measurement, keyof typeof MARGIN>>
type Probes = Pick<
  Measurement,
  'chartRerenders' | 'framesOver50' | 'maxFrameMs'
>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const path of Object.keys(ceilings)) {
  test(`drag-resize ${path} stays under its ceiling`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: FROM_WIDTH, height: HEIGHT },
    })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Performance.enable')
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    await page.evaluate(installProbes)
    await page.waitForTimeout(300)

    const before = await metrics(cdp)
    for (let step = 1; step <= STEPS; step++) {
      const width = Math.round(
        FROM_WIDTH + ((TO_WIDTH - FROM_WIDTH) * step) / STEPS,
      )
      await page.setViewportSize({ width, height: HEIGHT })
    }
    await page.waitForTimeout(500)
    const after = await metrics(cdp)
    const probes = (await page.evaluate(readProbes)) as Probes
    await context.close()

    const result: Measurement = {
      layouts: after.LayoutCount - before.LayoutCount,
      chartRerenders: probes.chartRerenders,
      scriptMs: Math.round(
        (after.ScriptDuration - before.ScriptDuration) * 1000,
      ),
      styleRecalcs: after.RecalcStyleCount - before.RecalcStyleCount,
      framesOver50: probes.framesOver50,
      maxFrameMs: probes.maxFrameMs,
    }
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
      chartRerenders: lowerOf(
        existing?.chartRerenders,
        MARGIN.chartRerenders(result.chartRerenders),
      ),
      scriptMs: lowerOf(existing?.scriptMs, MARGIN.scriptMs(result.scriptMs)),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})

function lowerOf(existing: number | undefined, measured: number) {
  return existing === undefined ? measured : Math.min(existing, measured)
}

async function metrics(cdp: {
  send: (
    m: 'Performance.getMetrics',
  ) => Promise<{ metrics: { name: string; value: number }[] }>
}) {
  const { metrics } = await cdp.send('Performance.getMetrics')
  const byName = Object.fromEntries(metrics.map((m) => [m.name, m.value]))
  return {
    LayoutCount: byName.LayoutCount ?? 0,
    RecalcStyleCount: byName.RecalcStyleCount ?? 0,
    ScriptDuration: byName.ScriptDuration ?? 0,
  }
}

// Strings rather than closures: tsx injects a __name helper the page lacks.
const installProbes = `(() => {
  const w = window
  w.__frameGaps = []
  w.__chartRerenders = 0
  let last = performance.now()
  const loop = () => {
    const now = performance.now()
    w.__frameGaps.push(now - last)
    last = now
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
  const observer = new MutationObserver((mutations) => { w.__chartRerenders += mutations.length })
  for (const svg of document.querySelectorAll('svg.recharts-surface')) {
    observer.observe(svg, { attributes: true, attributeFilter: ['width'] })
  }
})()`

const readProbes = `(() => {
  const gaps = window.__frameGaps
  return {
    chartRerenders: window.__chartRerenders,
    framesOver50: gaps.filter((g) => g > 50).length,
    maxFrameMs: Math.round(Math.max(...gaps)),
  }
})()`
