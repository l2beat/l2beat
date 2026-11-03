import { expect, type Page, test } from 'playwright/test'

/**
 * Page loads run a cross-document view transition (see `@view-transition`
 * in globals.css), in which the nav keeps its place and its active marker
 * slides. A name used twice on a page silently cancels the transition and
 * the page just swaps, so each test follows a real link and reads what the
 * new page's `pagereveal` event reports: whether a transition ran, and which
 * named parts it moved.
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(recordPageTransition)
})

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('a sidebar link keeps the sidebar and slides its pill', async ({
    page,
  }) => {
    await page.goto('/layer2s/summary')
    await followLink(page, '/layer2s/risk')
    expect(await transitionNames(page)).toEqual(
      expect.arrayContaining(['root', 'nav-sidebar', 'nav-sidebar-active']),
    )
  })

  test('going back runs a transition too', async ({ page }) => {
    await page.goto('/layer2s/summary')
    await followLink(page, '/layer2s/tvs')
    // A navigation while a transition still runs skips the next one.
    await page.waitForFunction(() => window.__pageTransitionFinished)
    await page.goBack()
    await expect(page).toHaveURL(/\/layer2s\/summary$/)
    expect(await transitionNames(page)).toContain('nav-sidebar-active')
  })

  for (const [from, to] of [
    ['/', '/layer2s/summary'],
    ['/layer2s/summary', '/layer2s/projects/arbitrum'],
  ] as const) {
    test(`${from} to ${to} runs a transition`, async ({ page }) => {
      await page.goto(from)
      await followLink(page, to)
      expect(await transitionNames(page)).toContain('nav-sidebar')
    })
  }

  test('the theme toggle reveals the page as one picture', async ({ page }) => {
    await page.goto('/layer2s/summary')
    await page.getByTitle('Change color scheme').click()
    await expect
      .poll(() => page.evaluate(() => window.runningTransitionNames()))
      .toEqual(['root'])
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('a tab keeps the navbar and slides the underline', async ({ page }) => {
    await page.goto('/layer2s/summary')
    await followLink(page, '/layer2s/risk')
    expect(await transitionNames(page)).toEqual(
      expect.arrayContaining([
        'root',
        'mobile-navbar',
        'mobile-nav-tab-underline',
      ]),
    )
  })

  test('a sub-tab slides its own underline', async ({ page }) => {
    await page.goto('/layer2s/risk')
    await followLink(page, '/layer2s/risk/sequencing')
    expect(await transitionNames(page)).toEqual(
      expect.arrayContaining([
        'mobile-nav-tab-underline',
        'mobile-nav-subtab-underline',
      ]),
    )
  })
})

test('reduced motion swaps pages without a transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/layer2s/summary')
  await followLink(page, '/layer2s/risk')
  await expect
    .poll(() => page.evaluate(() => window.__pageTransition))
    .toEqual({ state: 'none' })
})

declare global {
  interface Window {
    __pageTransition?:
      | { state: 'none' | 'started' }
      | { state: 'ready'; names: string[] }
      | { state: 'aborted'; error: string }
    __pageTransitionFinished?: boolean
    runningTransitionNames: () => string[]
  }
}

async function followLink(page: Page, href: string) {
  await page.locator(`a[href="${href}"]:visible`).first().click()
  await expect(page).toHaveURL((url) => url.pathname === href)
}

async function transitionNames(page: Page) {
  await page.waitForFunction(
    () =>
      window.__pageTransition && window.__pageTransition.state !== 'started',
  )
  const outcome = await page.evaluate(() => window.__pageTransition)
  if (outcome?.state !== 'ready') {
    throw new Error('No page transition', { cause: outcome })
  }
  return outcome.names
}

/** Runs in the browser, on every document, before the page's own scripts. */
function recordPageTransition() {
  /** Every part animates in a pseudo-element named after it. */
  window.runningTransitionNames = () => {
    const names = document
      .getAnimations()
      .map((a) => (a.effect as KeyframeEffect | null)?.pseudoElement)
      .map((p) => p?.match(/^::view-transition-[a-z-]+\((.+)\)$/)?.[1])
      .filter((name) => name !== undefined)
    return [...new Set(names)]
  }

  addEventListener('pagereveal', (event) => {
    const transition = (event as PageRevealEvent).viewTransition
    if (!transition) {
      window.__pageTransition = { state: 'none' }
      return
    }
    window.__pageTransition = { state: 'started' }
    transition.finished.finally(() => {
      window.__pageTransitionFinished = true
    })
    transition.ready.then(
      () => {
        window.__pageTransition = {
          state: 'ready',
          names: window.runningTransitionNames(),
        }
      },
      (error: Error) => {
        window.__pageTransition = {
          state: 'aborted',
          error: `${error.name}: ${error.message}`,
        }
      },
    )
  })
}
