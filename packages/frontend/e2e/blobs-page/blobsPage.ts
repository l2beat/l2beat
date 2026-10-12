import { test as base, expect, type Locator, type Page } from 'playwright/test'

/**
 * The blobs page as a reader meets it, on whatever screen the project gives:
 * the locators the suites share, and the waits that say what they wait for.
 *
 * Mock mode serves the page: its beacon node makes a block every 12 seconds
 * on the real clock, about two seconds into the slot, and what a block holds
 * follows from its slot alone, so the numbers a test reads are like mainnet's
 * without depending on it.
 */
export const test = base.extend<{ blobs: BlobsPage }>({
  blobs: async ({ page, hasTouch }, use) => {
    const uncaught: string[] = []
    page.on('pageerror', (error) => uncaught.push(error.message))
    await page.addInitScript(readWhatsNewAsClosed)
    // Batches open on Etherscan in a new tab; the tab gets a stand-in page
    await page
      .context()
      .route('https://etherscan.io/**', (route) =>
        route.fulfill({ contentType: 'text/html', body: 'Etherscan' }),
      )
    await use(createBlobsPage(page, hasTouch))
    expect(uncaught, 'errors the page threw').toEqual([])
  },
})

export { expect }

export const SLOT_MS = 12_000
/** A missed slot brings no block, so the next one can be two slots off */
export const NEXT_BLOCK_WITHIN_MS = 2 * SLOT_MS + 4_000

export type BlobsPage = ReturnType<typeof createBlobsPage>

function createBlobsPage(page: Page, hasTouch: boolean) {
  // the one card with a list of stats; its labels' text changes as blocks land
  const liveCard = page
    .locator('.primary-card')
    .filter({ has: page.locator('dl') })
  const belt = page.getByRole('img', { name: /^Ethereum blocks as they/ })
  const pulse = page.getByRole('slider', {
    name: 'Look back through the last 24 hours',
  })
  const posters = page.getByRole('region', {
    name: 'Who posted blobs in the last 24 hours',
  })

  return {
    page,
    /** Taps rather than hovers and clicks, as on a phone or a tablet */
    hasTouch,
    liveCard,
    /** "Live from Ethereum", or why it is not */
    status: liveCard.getByRole('status'),
    belt,
    pulse,
    posters,
    posterRows: posters.locator('tbody tr'),
    shareStrip: page.getByRole('img', { name: /blobs from \d+ projects$/ }),
    moreProjects: page.getByRole('link', { name: /^\+\d+ more$/ }),
    backToLive: page.getByRole('button', { name: 'Back to live' }),

    async open() {
      await page.goto('/blobs')
    },

    /**
     * Opens the page and waits for it to follow the chain. The belt asks for
     * blocks only while it is on screen, so it is scrolled to first
     */
    async openLive() {
      await this.open()
      await this.waitForLive()
    },

    async waitForLive() {
      await belt.scrollIntoViewIfNeeded()
      await expect(this.status).toContainText('Live', { timeout: 20_000 })
    },

    /** The newest slot the page has a block for */
    async head() {
      return Number(await pulse.getAttribute('aria-valuemax'))
    },

    /** Presses as a reader of this screen would: a tap, or a mouse click */
    async press(x: number, y: number) {
      if (hasTouch) await page.touchscreen.tap(x, y)
      else await page.mouse.click(x, y)
    },
  }
}

export async function box(locator: Locator) {
  const found = await locator.boundingBox()
  if (!found) throw new Error(`${locator} has no box`)
  return found
}

/**
 * How much of the belt is drawn in a poster's color, 0 to 1: its racks,
 * rules and labels are grays, so this is how much of it is tiles. Without
 * blocks it is under 0.01, live 0.05 on a phone and 0.1 on a desktop
 */
export function beltTileShare(belt: Locator) {
  return belt.evaluate((element) => {
    const canvas = element as HTMLCanvasElement
    const pixels = canvas
      .getContext('2d')
      ?.getImageData(0, 0, canvas.width, canvas.height).data
    if (!pixels) return 0
    let tiles = 0
    for (let i = 0; i < pixels.length; i += 4) {
      const [r = 0, g = 0, b = 0, a = 0] = pixels.subarray(i, i + 4)
      if (a > 200 && Math.max(r, g, b) - Math.min(r, g, b) > 80) tiles++
    }
    return tiles / (pixels.length / 4)
  })
}

/**
 * The changelog's "What's new" card floats over the bottom right corner,
 * where it would take taps meant for the belt. It stays closed once closed,
 * which these tests read as so from the start
 */
function readWhatsNewAsClosed() {
  const getItem = Storage.prototype.getItem
  Storage.prototype.getItem = function (key) {
    return key.startsWith('whats-new-') ? 'true' : getItem.call(this, key)
  }
}
