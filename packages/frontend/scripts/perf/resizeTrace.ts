import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

// Traces a drag-resize and attributes every style recalc and layout to the
// JS frame that forced it, so layout thrash has a name. Also lists the
// top-level JS tasks by inclusive time.
const base = process.env.BASE_URL ?? 'http://localhost:7357'
const path = process.env.PAGE ?? '/scaling/projects/arbitrum'
const steps = Number(process.env.STEPS ?? 30)
const fromWidth = Number(process.env.FROM ?? 1400)
const toWidth = Number(process.env.TO ?? 800)

interface Frame {
  functionName?: string
  url?: string
  lineNumber?: number
  columnNumber?: number
}
interface TraceEvent {
  name: string
  ph: string
  ts: number
  dur?: number
  args?: {
    beginData?: { stackTrace?: Frame[] }
    data?: Frame & { type?: string; stackTrace?: Frame[] }
  }
}
type Bucket = { n: number; ms: number }

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: fromWidth, height: 900 },
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await page.goto(base + path, { waitUntil: 'networkidle' })
  // INJECT_CSS lets a CSS-only hypothesis be measured without a rebuild.
  if (process.env.INJECT_CSS) {
    await page.addStyleTag({ content: process.env.INJECT_CSS })
  }
  await page.waitForTimeout(1500)
  const events: TraceEvent[] = []
  cdp.on('Tracing.dataCollected', (d) => {
    events.push(...(d.value as unknown as TraceEvent[]))
  })
  await cdp.send('Tracing.start', {
    traceConfig: {
      includedCategories: [
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.stack',
      ],
    },
    transferMode: 'ReportEvents',
  })
  for (let i = 1; i <= steps; i++) {
    await page.setViewportSize({
      width: Math.round(fromWidth + ((toWidth - fromWidth) * i) / steps),
      height: 900,
    })
  }
  await page.waitForTimeout(500)
  const complete = new Promise<void>((resolve) =>
    cdp.once('Tracing.tracingComplete', () => resolve()),
  )
  await cdp.send('Tracing.end')
  await complete
  await browser.close()
  writeFileSync(
    '/tmp/resize.trace.json',
    JSON.stringify({ traceEvents: events }),
  )

  const spans = events.filter(
    (e): e is TraceEvent & { dur: number } =>
      e.ph === 'X' && e.dur !== undefined,
  )
  for (const name of [
    'UpdateLayoutTree',
    'Layout',
    'FunctionCall',
    'EventDispatch',
    'Paint',
  ]) {
    const xs = spans.filter((e) => e.name === name)
    console.log(name, {
      count: xs.length,
      ms: Math.round(xs.reduce((a, b) => a + b.dur, 0) / 1000),
    })
  }

  for (const name of ['UpdateLayoutTree', 'Layout']) {
    const forced = new Map<string, Bucket>()
    for (const e of spans.filter((e) => e.name === name)) {
      const top = (e.args?.beginData?.stackTrace ??
        e.args?.data?.stackTrace)?.[0]
      add(forced, top ? frameLabel(top) : '(not forced by JS)', e.dur)
    }
    print(`${name} by forcing frame`, forced)
  }

  const tasks = new Map<string, Bucket>()
  for (const e of spans.filter(
    (e) => e.name === 'FunctionCall' || e.name === 'EventDispatch',
  )) {
    const d = e.args?.data ?? {}
    add(
      tasks,
      e.name === 'EventDispatch' ? `event:${d.type}` : frameLabel(d),
      e.dur,
    )
  }
  print('top-level JS tasks (FunctionCall/EventDispatch, inclusive)', tasks)
}

function add(m: Map<string, Bucket>, key: string, durUs: number) {
  const cur = m.get(key) ?? { n: 0, ms: 0 }
  cur.n++
  cur.ms += durUs / 1000
  m.set(key, cur)
}

function print(title: string, m: Map<string, Bucket>) {
  console.log(`--- ${title}`)
  for (const [k, v] of [...m].sort((a, b) => b[1].ms - a[1].ms).slice(0, 15)) {
    console.log(
      String(v.n).padStart(5),
      `${String(Math.round(v.ms)).padStart(6)}ms`,
      k,
    )
  }
}

function frameLabel(f: Frame) {
  const file = String(f.url ?? '')
    .split('/')
    .pop()
  return `${f.functionName || '(anon)'} ${file}:${f.lineNumber}:${f.columnNumber}`
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
