import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

// CPU-profiles a drag-resize and prints the hottest functions by self and
// total time, so a ceiling breach in e2e/resize-perf can be traced to code.
// Minified names map back through dist/client/assets at the printed offset.
const base = process.env.BASE_URL ?? 'http://localhost:7357'
const path = process.env.PAGE ?? '/scaling/projects/arbitrum'
const steps = Number(process.env.STEPS ?? 30)

interface ProfileNode {
  id: number
  callFrame: {
    functionName: string
    url: string
    lineNumber: number
    columnNumber: number
  }
  children?: number[]
}

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await cdp.send('Profiler.enable')
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 })
  await cdp.send('Profiler.start')
  for (let i = 1; i <= steps; i++) {
    await page.setViewportSize({
      width: Math.round(1400 - (600 * i) / steps),
      height: 900,
    })
  }
  await page.waitForTimeout(500)
  const { profile } = await cdp.send('Profiler.stop')
  writeFileSync('/tmp/resize.cpuprofile', JSON.stringify(profile))
  await browser.close()

  const byId = new Map(profile.nodes.map((n) => [n.id, n]))
  const parent = new Map<number, number>()
  for (const n of profile.nodes) {
    for (const c of n.children ?? []) parent.set(c, n.id)
  }
  const selfMs = new Map<string, number>()
  const totalMs = new Map<string, number>()
  const deltas = profile.timeDeltas ?? []
  ;(profile.samples ?? []).forEach((id, i) => {
    const ms = (deltas[i] ?? 0) / 1000
    const seen = new Set<string>()
    for (
      let cur: number | undefined = id;
      cur !== undefined;
      cur = parent.get(cur)
    ) {
      const node = byId.get(cur)
      if (!node) break
      const key = label(node)
      if (cur === id) selfMs.set(key, (selfMs.get(key) ?? 0) + ms)
      if (seen.has(key)) continue
      seen.add(key)
      totalMs.set(key, (totalMs.get(key) ?? 0) + ms)
    }
  })
  print('top self time (ms)', selfMs)
  print('top total time (ms)', totalMs)
}

function print(title: string, m: Map<string, number>) {
  console.log(`--- ${title}`)
  for (const [k, ms] of [...m].sort((a, b) => b[1] - a[1]).slice(0, 35)) {
    console.log(ms.toFixed(0).padStart(6), k)
  }
}

function label(n: ProfileNode) {
  const f = n.callFrame
  const file = f.url.split('/').slice(-1)[0]
  return `${f.functionName || '(anon)'} ${file}:${f.lineNumber + 1}:${f.columnNumber + 1}`
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
