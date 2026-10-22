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

for (const viewport of viewports) {
  test(`hash on load lands on the section at ${viewport.width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto(`${PAGE}#permissions`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    // The page scrolls smoothly, so on a slow runner the jump to the fragment
    // can still be on its way.
    await expect.poll(() => sectionTop(page, 'permissions')).toBeLessThan(100)
    await waitForScrollToSettle(page)
    expect(await sectionTop(page, 'permissions')).toBeLessThan(100)
    expect(await sectionTop(page, 'permissions')).toBeGreaterThanOrEqual(0)
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
