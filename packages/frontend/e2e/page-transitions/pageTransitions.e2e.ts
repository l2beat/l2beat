import { expect, type Page, test } from 'playwright/test'

/**
 * The sidebar's motion between pages runs from a script inlined in <head>
 * (src/ssr/head/pageTransitions.ts). A build can break it with no other
 * sign, e.g. once `String.replace` read a `$&` in the minified script as a
 * pattern and every page shipped it cut short. These check that it runs,
 * starts the transition, and leaves nothing of its own on the page.
 */

const FROM = '/layer2s/summary'

test('a sidebar link starts the nav transition and cleans up after it', async ({
  page,
}) => {
  const errors = watchErrors(page)
  await recordArrivals(page)
  await page.goto(FROM, { waitUntil: 'networkidle' })

  await sidebarLink(page, 'Liveness').click()
  await page.waitForURL('**/layer2s/liveness')
  const arrival = await waitForArrival(page)

  expect(arrival.types).toEqual(['nav'])
  // Captured and animated, not skipped
  expect(arrival.ready).toBe(true)
  expect(arrival.finished).toBe(true)
  await expect
    .poll(() => leftovers(page))
    .toEqual({
      named: 0,
      inks: 0,
      marked: false,
      listHeight: '',
    })
  expect(errors).toEqual([])
})

test('with reduced motion, pages swap at once', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = watchErrors(page)
  await recordArrivals(page)
  await page.goto(FROM, { waitUntil: 'networkidle' })

  await sidebarLink(page, 'Liveness').click()
  await page.waitForURL('**/layer2s/liveness')
  const arrival = await waitForArrival(page)

  expect(arrival.types).toEqual([])
  expect(errors).toEqual([])
  await context.close()
})

test('a step that throws skips the transition and leaves nothing behind', async ({
  page,
}) => {
  const errors = watchErrors(page)
  await recordArrivals(page)
  // The script builds the motion with DOMMatrix once the transition is ready
  await page.addInitScript(() => {
    if (location.pathname.endsWith('/liveness')) {
      window.DOMMatrix = class {
        constructor() {
          throw new Error('broken step')
        }
      } as unknown as typeof DOMMatrix
    }
  })
  await page.goto(FROM, { waitUntil: 'networkidle' })

  await sidebarLink(page, 'Liveness').click()
  await page.waitForURL('**/layer2s/liveness')
  const arrival = await waitForArrival(page)

  expect(arrival.finished).toBe(true)
  await expect
    .poll(() => leftovers(page))
    .toEqual({ named: 0, inks: 0, marked: false, listHeight: '' })
  await expect.poll(() => errors).toEqual(['broken step'])
  await expect(page.locator('h1, h2').first()).toBeVisible()
})

function sidebarLink(page: Page, name: string) {
  return page
    .locator('[data-sidebar-scroll]:visible a', {
      hasText: new RegExp(`^${name}$`),
    })
    .first()
}

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

/**
 * Records, on every page, the view transition it arrives with, once it
 * ends: its types, whether it got to animate (`ready`), and whether it ran
 * to the end. None counts as none run.
 */
async function recordArrivals(page: Page) {
  await page.addInitScript(() => {
    addEventListener('pagereveal', (e) => {
      const transition = e.viewTransition
      if (!transition) {
        ;(window as { arrival?: unknown }).arrival = {
          types: [],
          ready: false,
          finished: false,
        }
        return
      }
      let ready = false
      transition.ready.then(
        () => (ready = true),
        () => {},
      )
      const settle = (finished: boolean) => {
        ;(window as { arrival?: unknown }).arrival = {
          types: [...transition.types],
          ready,
          finished,
        }
      }
      transition.finished.then(
        () => settle(true),
        () => settle(false),
      )
    })
  })
}

async function waitForArrival(page: Page) {
  const handle = await page.waitForFunction(
    () => (window as { arrival?: unknown }).arrival,
  )
  return (await handle.jsonValue()) as {
    types: string[]
    ready: boolean
    finished: boolean
  }
}

/** What the script sets during a transition, once it is over. */
function leftovers(page: Page) {
  return page.evaluate(() => ({
    named: [...document.querySelectorAll<HTMLElement>('[style]')].filter(
      (el) => el.style.viewTransitionName,
    ).length,
    inks: document.querySelectorAll('body > span[aria-hidden="true"]').length,
    marked: document.documentElement.hasAttribute('data-page-transition'),
    listHeight:
      document.querySelector<HTMLElement>('[data-sidebar-scroll]')?.style
        .maxHeight ?? '',
  }))
}
