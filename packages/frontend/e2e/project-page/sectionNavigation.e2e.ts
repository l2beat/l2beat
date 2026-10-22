import { expect, test } from 'playwright/test'

/**
 * Project sections skip rendering while off screen (see LazyHydrate). The
 * browser then positions fragment targets from remembered heights, so this
 * checks that a hash on load and a section-navigation click still land on
 * the section, at a desktop and a tablet width.
 */
const PAGE = '/scaling/projects/base'
const INTEROP_TOKEN_PAGE = '/interop/tokens/usdc01'
const DESKTOP = { width: 1400, height: 900 }
const TABLET = { width: 900, height: 900 }
const viewports = [DESKTOP, TABLET]

const PROBE = `(() => {
  const t0 = performance.now()
  const now = () => Math.round(performance.now() - t0)
  const d = (window.__diag = { events: [], scroll: [], snaps: {} })
  const wrappers = () => [...document.querySelectorAll('section[id]')].map((s) => {
    const w = s.parentElement
    return [s.id, Math.round(w.getBoundingClientRect().height), w.className.includes('content-visibility') ? 'cv' : '-', Object.keys(s).some((k) => k.startsWith('__react')) ? 'R' : '-']
  })
  d.wrappers = wrappers
  const snap = (name) => { d.snaps[name] = { t: now(), y: Math.round(scrollY), h: document.documentElement.scrollHeight, w: wrappers() } }
  document.addEventListener('DOMContentLoaded', () => snap('dcl'))
  addEventListener('load', () => { snap('load'); d.events.push([now(), 'load']) })
  addEventListener('resize', () => d.events.push([now(), 'resize', innerWidth, innerHeight]))
  addEventListener('scrollend', () => d.events.push([now(), 'scrollend', Math.round(scrollY)]))
  addEventListener('hashchange', () => d.events.push([now(), 'hashchange']))
  document.fonts.addEventListener('loadingdone', (e) => d.events.push([now(), 'fonts', e.fontfaces.map((f) => f.family + ' ' + f.weight).join(',')]))
  new PerformanceObserver((l) => { for (const e of l.getEntries()) d.events.push([now(), 'shift', Math.round(e.value * 1000), e.sources?.map((s) => (s.node?.id || s.node?.nodeName) + ':' + Math.round(s.previousRect.top) + '>' + Math.round(s.currentRect.top)).join(' ')]) }).observe({ type: 'layout-shift', buffered: true })
  let scrolled = false
  const tick = () => {
    const el = document.getElementById('permissions')
    const top = el ? Math.round(el.getBoundingClientRect().top) : null
    const y = Math.round(scrollY)
    const last = d.scroll.at(-1)
    if (!last || last[1] !== y || last[2] !== top) d.scroll.push([now(), y, top, document.documentElement.scrollHeight])
    if (!scrolled && y > 0) { scrolled = true; snap('scrollStart') }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})()`

for (let copy = 0; copy < 10; copy++)
for (const viewport of viewports) {
  test(`hash on load lands on the section at ${viewport.width}px #${copy}`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.addInitScript(PROBE)
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning')
        console.log('[console]', m.type(), m.text().slice(0, 300))
    })
    page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 300)))
    await page.goto(`${PAGE}#permissions`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    const top = await sectionTop(page, 'permissions')
    const diag = await page.evaluate(`(() => {
      const d = window.__diag
      const end = { y: Math.round(scrollY), h: document.documentElement.scrollHeight, w: d.wrappers() }
      for (const s of document.querySelectorAll('section[id]')) s.parentElement.style.contentVisibility = 'visible'
      const real = { top: Math.round(document.getElementById('permissions').getBoundingClientRect().top), w: d.wrappers() }
      return { ua: navigator.userAgent, dpr: devicePixelRatio, events: d.events, scroll: d.scroll.slice(0, 5).concat(['...'], d.scroll.slice(-25)), snaps: d.snaps, end, real }
    })()`)
    console.log(
      `DIAG ${viewport.width} copy=${copy} worker=${testInfo.workerIndex} top=${top} ${top < 100 && top >= 0 ? 'OK' : 'BAD'} ${JSON.stringify(diag)}`,
    )
    expect(top).toBeLessThan(100)
    expect(top).toBeGreaterThanOrEqual(0)
    await context.close()
  })
}

test('section navigation click lands on the section', async ({ browser }) => {
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()
  await page.goto(PAGE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  for (const id of ['state-validation', 'contracts', 'tvs']) {
    await page.locator(`a[href="#${id}"]:visible`).first().click()
    await waitForScrollToSettle(page)
    expect(await sectionTop(page, id), id).toBeLessThan(100)
    expect(await sectionTop(page, id), id).toBeGreaterThanOrEqual(0)
  }
  await context.close()
})

// A fragment click fires popstate, which the interop chain selector answers
// with a state update, so this page re-renders sections not yet hydrated.
// Doing so must keep their server markup, or the jump finds nothing to land on.
test('section navigation click keeps unhydrated sections', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()
  await page.goto(INTEROP_TOKEN_PAGE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  // Mounting a section swaps its markup in one batch; a wipe leaves the
  // wrapper empty.
  await page.evaluate(`(() => {
    window.__emptiedWrappers = 0
    for (const section of document.querySelectorAll('section[id]')) {
      const wrapper = section.parentElement
      new MutationObserver(() => {
        if (wrapper.childElementCount === 0) window.__emptiedWrappers++
      }).observe(wrapper, { childList: true })
    }
  })()`)
  await page.locator('a[href="#onchain-deployments"]:visible').first().click()
  await waitForScrollToSettle(page)
  expect(await page.evaluate('window.__emptiedWrappers')).toBe(0)
  expect(await sectionTop(page, 'onchain-deployments')).toBeLessThan(100)
  expect(await sectionTop(page, 'onchain-deployments')).toBeGreaterThanOrEqual(
    0,
  )
  await context.close()
})

// Skipped sections remember the height they had at the last width they were
// laid out at, so a jump after a resize is the case most likely to land off.
test('section navigation lands after resizing desktop to tablet', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()
  await page.goto(PAGE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.setViewportSize(TABLET)
  await page.waitForTimeout(1000)
  await page.locator('a[href="#state-validation"]:visible').first().click()
  await waitForScrollToSettle(page)
  expect(await sectionTop(page, 'state-validation')).toBeLessThan(100)
  expect(await sectionTop(page, 'state-validation')).toBeGreaterThanOrEqual(0)
  await context.close()
})

async function sectionTop(
  page: { evaluate: (expression: string) => Promise<unknown> },
  id: string,
) {
  return (await page.evaluate(
    `Math.round(document.getElementById('${id}').getBoundingClientRect().top)`,
  )) as number
}

// The page scrolls smoothly; settle means six polls at the same offset.
async function waitForScrollToSettle(page: {
  waitForFunction: (
    expression: string,
    arg: null,
    options: { polling: number },
  ) => Promise<unknown>
}) {
  await page.waitForFunction(
    `(() => {
      const y = scrollY
      window.__stable = window.__lastY === y ? (window.__stable ?? 0) + 1 : 0
      window.__lastY = y
      return window.__stable > 5
    })()`,
    null,
    { polling: 50 },
  )
}
