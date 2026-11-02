import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'playwright/test'

/**
 * Ratchet for page-to-page navigation with a warm cache: every page gets a
 * ceiling on the JS chunks it loads, and the ceiling only moves down.
 *
 * Each chunk costs the renderer's main thread a request, a compile and a
 * module link, whatever its size, and that work competes with first paint:
 * cutting a project page from 166 chunks to 50 (../smallSharedChunks.mts)
 * made warm navigations paint sooner in 62 of 71 paired rounds on an M1 Pro.
 * The count is the proxy because it is the same on every machine. First
 * paint is logged, not asserted (see ../README.md).
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * ceilings.json from the current run.
 */
const CEILINGS_FILE = join(__dirname, 'ceilings.json')
const FROM = '/blobs'

type Measurement = { jsChunks: number }
type Ceilings = Record<string, Measurement>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const path of Object.keys(ceilings)) {
  test(`navigating to ${path} stays under its ceiling`, async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    // Fill the cache, as for someone already browsing the site
    await page.goto(path, { waitUntil: 'load' })
    await page.goto(FROM, { waitUntil: 'load' })

    await page.goto(path, { waitUntil: 'load' })
    const { jsChunks, firstPaintMs } = await page.evaluate(async () => {
      const scripts = performance
        .getEntriesByType('resource')
        .filter((r) => /\/static\/assets\/.*\.js$/.test(r.name))
      // On a busy machine first paint can come after the load event
      const paint = await new Promise<PerformanceEntry | undefined>(
        (resolve) => {
          new PerformanceObserver((list) => {
            resolve(list.getEntriesByName('first-contentful-paint')[0])
          }).observe({ type: 'paint', buffered: true })
          setTimeout(() => resolve(undefined), 5000)
        },
      )
      return {
        jsChunks: new Set(scripts.map((r) => r.name)).size,
        firstPaintMs: Math.round(paint?.startTime ?? -1),
      }
    })
    await context.close()

    measured[path] = { jsChunks }
    console.log(path, JSON.stringify({ jsChunks, firstPaintMs }))

    if (process.env.UPDATE_CEILINGS) return
    const ceiling = ceilings[path]
    expect(ceiling).toBeDefined()
    expect(jsChunks, `JS chunks on ${path}`).toBeLessThanOrEqual(
      ceiling!.jsChunks,
    )
  })
}

test.afterAll(() => {
  if (!process.env.UPDATE_CEILINGS) return
  const next: Ceilings = { ...ceilings }
  for (const [path, result] of Object.entries(measured)) {
    next[path] = {
      jsChunks: Math.min(
        ceilings[path]?.jsChunks ?? Number.POSITIVE_INFINITY,
        result.jsChunks,
      ),
    }
  }
  writeFileSync(CEILINGS_FILE, `${JSON.stringify(next, null, 2)}\n`)
})
