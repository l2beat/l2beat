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
  openBlobs,
  readProbes,
  resetProbes,
  SLOT_MS,
  traceEvents,
  untilNextSlotMs,
} from './blobsPage'

/**
 * Ratchet for swiping the belt on a phone while a block lands. A swipe moves
 * the belt a rack at a time, and a landing animates the numbers, the strip of
 * shares and the posters table around it, so a swipe that meets a landing is
 * where the belt stops keeping up with the finger.
 *
 * Each swipe starts 1.2 seconds into a slot, before mock mode's block comes
 * in at two, and goes back and forth across it with a real touch: four racks
 * right, eight left, four right, ending where it started. Mock mode makes
 * each slot's block from its number, so the data is fixed; what varies is
 * which slot, and with it how much lands, which is why the best of a few
 * swipes counts. A slot whose block was missed animates nothing, and would
 * be the best by far, so it is swiped past rather than counted.
 *
 * The main proxy is how many elements the browser restyles, which does not
 * depend on the machine's speed; against the iOS simulator it moved with the
 * frames that ran long. Layouts come with it, and script time with wide
 * headroom only. Slow frames are logged, not asserted.
 *
 * Lower a ceiling by running with UPDATE_CEILINGS=1, which rewrites
 * swipeCeilings.json from the current run plus the margins below.
 */
const CEILINGS_FILE = join(__dirname, 'swipeCeilings.json')
const START_INTO_SLOT_MS = 1_200
const SWIPES = 3
/** Swipes allowed beyond `SWIPES` for slots that turn out missed */
const SPARE_SWIPES = 2
/** Pixels the finger moves each step, a step a frame */
const STEP_PX = 2.4
const STEP_MS = 16
/** A rack is 30 px, so this is four racks */
const REACH_PX = 120

const MARGIN = {
  restyledElements: (n: number) => Math.ceil(n * 1.5),
  layouts: (n: number) => Math.ceil(n * 1.5),
  scriptMs: (n: number) => n * 4,
}

type Measurement = {
  restyledElements: number
  layouts: number
  scriptMs: number
  beltPaints: number
  framesOverBudget: number
  maxFrameMs: number
}
type Ceilings = Record<string, Pick<Measurement, keyof typeof MARGIN>>

const ceilings: Ceilings = JSON.parse(readFileSync(CEILINGS_FILE, 'utf8'))
const measured: Ceilings = {}

for (const viewport of Object.keys(ceilings)) {
  test(`swiping the /blobs belt at ${viewport} as a block lands stays under its ceiling`, async ({
    browser,
  }) => {
    // up to two slots for each swipe: one to reach its start, one to swipe
    test.setTimeout(2 * (SWIPES + SPARE_SWIPES) * SLOT_MS + 30_000)
    const [width, height] = viewport.split('x').map(Number)
    const { page, cdp, close } = await openBlobs(browser, width!, height!, {
      touch: true,
    })
    await page.evaluate(countAnimations)

    const runs: Measurement[] = []
    for (
      let swipe = 0;
      swipe < SWIPES + SPARE_SWIPES && runs.length < SWIPES;
      swipe++
    ) {
      const run = await swipeAcrossLanding(page, cdp, browser)
      if (run) runs.push(run)
      await backToLive(page)
    }
    expect(runs, 'swipes with a block landing').toHaveLength(SWIPES)
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

/** What a swipe across a landing cost, or undefined if the block was missed */
async function swipeAcrossLanding(
  page: Page,
  cdp: CDPSession,
  browser: Browser,
): Promise<Measurement | undefined> {
  const box = await page.locator('canvas[role=img]').boundingBox()
  if (!box) throw new Error('The belt is not on the page')
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  await page.waitForTimeout(untilNextSlotMs() + START_INTO_SLOT_MS)
  await page.evaluate(resetProbes)
  await page.evaluate('window.__animations = 0')
  const before = await metrics(cdp)
  await browser.startTracing(page, {
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'],
  })
  await swipe(page, cdp, x, y)
  const trace = await browser.stopTracing()
  const after = await metrics(cdp)
  const landed = (await page.evaluate('window.__animations')) as number
  if (landed === 0) return undefined
  const probes = (await page.evaluate(readProbes)) as Pick<
    Measurement,
    'beltPaints' | 'framesOverBudget' | 'maxFrameMs'
  >
  return {
    restyledElements: countRestyledElements(traceEvents(trace)),
    layouts: after.LayoutCount - before.LayoutCount,
    scriptMs: Math.round((after.ScriptDuration - before.ScriptDuration) * 1000),
    ...probes,
  }
}

/** A finger on the belt, four racks right, eight left, four right, lifted */
async function swipe(page: Page, cdp: CDPSession, x: number, y: number) {
  const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', at?: number) =>
    cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: at === undefined ? [] : [{ x: at, y }],
    })
  const legs = [REACH_PX, -2 * REACH_PX, REACH_PX]
  let at = x
  await touch('touchStart', at)
  for (const leg of legs) {
    const steps = Math.abs(leg) / STEP_PX
    for (let i = 0; i < steps; i++) {
      at += Math.sign(leg) * STEP_PX
      await touch('touchMove', at)
      await page.waitForTimeout(STEP_MS)
    }
  }
  await touch('touchEnd')
}

/** The swipe ends where it began, which the chain has moved on from by then */
async function backToLive(page: Page) {
  const button = page.getByRole('button', { name: 'Back to live' })
  if (await button.isVisible()) await button.click()
}

// Each landing pops its "+N" and washes its row, while a swipe alone animates
// nothing; a string, as tsx injects a helper the page lacks into closures
const countAnimations = `(() => {
  window.__animations = 0
  const animate = Element.prototype.animate
  Element.prototype.animate = function (...args) {
    window.__animations++
    return animate.apply(this, args)
  }
})()`
