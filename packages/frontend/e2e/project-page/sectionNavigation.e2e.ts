import { expect, test } from 'playwright/test'

/**
 * Project sections skip rendering while off screen (see LazyHydrate). The
 * browser then positions fragment targets from remembered heights, so this
 * checks that a hash on load and a section-navigation click still land on
 * the section, at a desktop and a tablet width.
 */
const PAGE = '/scaling/projects/base'
const viewports = [
  { width: 1400, height: 900 },
  { width: 900, height: 900 },
]

for (const viewport of viewports) {
  test(`hash on load lands on the section at ${viewport.width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto(`${PAGE}#permissions`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    expect(await sectionTop(page, 'permissions')).toBeLessThan(100)
    expect(await sectionTop(page, 'permissions')).toBeGreaterThanOrEqual(0)
    await context.close()
  })
}

test('section navigation click lands on the section', async ({ browser }) => {
  const context = await browser.newContext({ viewport: viewports[0] })
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
