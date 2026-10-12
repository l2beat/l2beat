import type { Page } from 'playwright/test'
import {
  type BlobsPage,
  beltTileShare,
  box,
  expect,
  NEXT_BLOCK_WITHIN_MS,
  test,
} from './blobsPage'

/**
 * The live card: the day's numbers, the belt of blocks with the day under
 * it, and who posted. Each test follows the chain as a reader would, on the
 * screen its project gives, and checks what they would see go wrong: numbers
 * that never come, things that jump as they come, a label drawn over another,
 * a card cut off by the screen's edge.
 */
test.describe.configure({ mode: 'parallel' })

test('fills the numbers in where their placeholders stood, moving nothing', async ({
  blobs,
  page,
}) => {
  const feed = await holdLiveFeed(page)
  await blobs.open()
  await blobs.belt.scrollIntoViewIfNeeded()
  await feed.asked
  await expect(blobs.status).toContainText('Connecting')
  const before = await liveCardLayout(page)

  feed.release()
  await expect(blobs.status).toContainText('Live')
  await expect(blobs.shareStrip).toBeVisible()
  await expect(blobs.posterRows.first()).toBeVisible()
  const after = await liveCardLayout(page)

  // The placeholders hold as many digits as the mock's numbers, so a label
  // beside a number moves by no more than the number's own rounding
  for (const [i, label] of before.labels.entries()) {
    const now = after.labels[i]!
    expect(now.y, `${label.text} label, down`).toBe(label.y)
    expect(
      Math.abs(now.x - label.x),
      `${label.text} label, across`,
    ).toBeLessThanOrEqual(2)
  }
  expect(after.status, 'status').toBe(before.status)
  expect(after.belt, 'the belt, the day and their legend').toEqual(before.belt)
  expect(after.postersTop, 'the table').toBe(before.postersTop)
})

test('takes in each new block, naming its batches clear of other labels', async ({
  blobs,
  page,
}) => {
  test.setTimeout(NEXT_BLOCK_WITHIN_MS + 30_000)
  await page.addInitScript(recordBeltLabels)
  await blobs.openLive()
  const head = await blobs.head()

  await expect
    .poll(() => blobs.head(), { timeout: NEXT_BLOCK_WITHIN_MS })
    .toBeGreaterThan(head)
  // a block with no blobs names nothing; the one after it will
  await expect
    .poll(() => readBeltLabels(page).then((l) => l.arrivals), {
      timeout: NEXT_BLOCK_WITHIN_MS,
    })
    .toBeGreaterThan(0)
  // the labels rise and fade over 3.5 seconds from when they show
  await page.waitForTimeout(4_000)

  const labels = await readBeltLabels(page)
  expect(labels.overlaps, 'labels drawn over each other').toEqual([])
  expect(labels.cut, "labels cut by the belt's edges").toEqual([])
  // counted down only while seen, which on a phone the belt's view is not
  await blobs.status.scrollIntoViewIfNeeded()
  await expect(
    blobs.liveCard.getByText(/^Next block in ([1-9]|1[0-2])s$/),
  ).toBeVisible()
})

test("draws the belt's tiles sharp, at the density of the screen", async ({
  blobs,
}) => {
  await blobs.openLive()
  // as dense as the screen, up to twice the CSS pixels, past which a canvas
  // this size costs more to fill than the eye can tell apart
  const canvas = await blobs.belt.evaluate((element) => {
    const c = element as HTMLCanvasElement
    const density = Math.min(devicePixelRatio, 2)
    return {
      width: c.width,
      height: c.height,
      expectedWidth: Math.round(c.clientWidth * density),
      expectedHeight: Math.round(c.clientHeight * density),
    }
  })
  expect(canvas.width).toBe(canvas.expectedWidth)
  expect(canvas.height).toBe(canvas.expectedHeight)
  // the blocks in view are filled with their posters' tiles, once faded in
  await expect.poll(() => beltTileShare(blobs.belt)).toBeGreaterThan(0.02)
  await expect(blobs.belt).toHaveAccessibleName(
    /The last \d+ carried [\d.]+ blobs on average, against a target of \d+\./,
  )
})

test("names a batch's poster, keeping its card on the screen", async ({
  blobs,
  page,
}) => {
  await blobs.openLive()
  const names = await posterNames(blobs)
  const belt = await box(blobs.belt)
  const screen = page.viewportSize()!
  const card = page
    .getByText('Batch', { exact: true })
    .locator('xpath=ancestor::div[contains(@class, "absolute")][1]')

  // Along the bottom row of tiles, which every block with blobs fills, from
  // the oldest block in view to the bay. A tap pins the card; a mouse hovers
  const y = belt.y + belt.height - 48
  const across = range(
    belt.x + 20,
    belt.x + belt.width * 0.7,
    blobs.hasTouch ? 30 : 15,
  )
  const showCardAt = async (x: number) => {
    if (blobs.hasTouch) await page.touchscreen.tap(x, y)
    else await page.mouse.move(x, y)
    await page.waitForTimeout(60)
    return card.isVisible()
  }
  let shown = 0
  for (const x of across) {
    if (!(await showCardAt(x))) continue
    shown++
    const at = await box(card)
    const where = `pressed ${Math.round(x - belt.x)}px into the belt`
    expect(at.x, where).toBeGreaterThanOrEqual(Math.max(0, belt.x) - 1)
    expect(at.x + at.width, where).toBeLessThanOrEqual(
      Math.min(screen.width, belt.x + belt.width) + 1,
    )
    const poster = await card.locator(':scope > div > div').first().innerText()
    expect(names, where).toContain(poster.trim())
    await expect(card).toContainText(/Batch\s*\d+ blobs?/)
    await expect(card).toContainText(/Slot\s*[\d,]+/)
    await expect(card).toContainText(/Block\s*[\d,]+/)
  }
  expect(shown, 'batches whose card showed').toBeGreaterThan(2)

  // Then to Etherscan: a click on a hovered batch, a tap on a pinned card's link
  let x = across[0]!
  for (const next of across) {
    x = next
    if (await showCardAt(x)) break
  }
  const opened = page.waitForEvent('popup')
  if (blobs.hasTouch) {
    const link = card.getByRole('link', { name: 'Open on Etherscan' })
    await expect(link).toHaveAttribute('target', '_blank')
    await link.tap()
  } else {
    await expect(card).toContainText('Click to open on Etherscan')
    await page.mouse.click(x, y)
  }
  const etherscan = await opened
  expect(etherscan.url()).toMatch(/^https:\/\/etherscan\.io\/tx\/0x[0-9a-f]+$/)
  await etherscan.close()

  // a pinned card stays until a tap anywhere off the belt
  if (blobs.hasTouch) {
    await expect(card).toBeVisible()
    await blobs.liveCard.locator('dt').first().tap()
    await expect(card).toBeHidden()
  }
})

test('takes the belt back through the day, and back to live', async ({
  blobs,
}) => {
  await blobs.openLive()
  await blobs.pulse.scrollIntoViewIfNeeded()
  await expect(blobs.pulse).toHaveAttribute('aria-valuetext', 'Live')
  await expect(blobs.backToLive).toBeHidden()

  const day = await box(blobs.pulse)
  await blobs.press(day.x + day.width * 0.3, day.y + day.height / 2)
  await expect(blobs.pulse).toHaveAttribute('aria-valuetext', / ago$/)
  const brush = await sliderValues(blobs)
  expect(brush.now).toBeLessThan(brush.max)
  expect(brush.now).toBeGreaterThanOrEqual(brush.min)
  // the caption says when that was
  const caption = blobs.pulse.locator('xpath=following-sibling::div[1]')
  await expect(caption).toContainText(/\d{1,2}:\d{2}/)

  if (blobs.hasTouch) await blobs.backToLive.tap()
  else await blobs.backToLive.click()
  await expect(blobs.pulse).toHaveAttribute('aria-valuetext', 'Live')
  await expect(blobs.backToLive).toBeHidden()
})

test('steps the belt through the day with the keyboard and a drag', async ({
  blobs,
  page,
}) => {
  test.skip(blobs.hasTouch, 'Keys and drags are for a keyboard and a mouse')
  await blobs.openLive()
  await blobs.pulse.scrollIntoViewIfNeeded()
  await blobs.pulse.focus()

  await page.keyboard.press('ArrowLeft')
  await expect
    .poll(() => sliderValues(blobs).then((v) => v.max - v.now))
    .toBe(1)
  await page.keyboard.press('Home')
  await expect
    .poll(() => sliderValues(blobs).then((v) => v.now - v.min))
    .toBe(0)
  await page.keyboard.press('PageUp')
  await expect
    .poll(() => sliderValues(blobs).then((v) => v.now - v.min))
    .toBe(300)
  await page.keyboard.press('Escape')
  await expect(blobs.pulse).toHaveAttribute('aria-valuetext', 'Live')

  // the band over the newest blocks, carried halfway back
  const day = await box(blobs.pulse)
  const middle = day.y + day.height / 2
  await page.mouse.move(day.x + day.width - 2, middle)
  await page.mouse.down()
  await page.mouse.move(day.x + day.width * 0.5, middle, { steps: 8 })
  await page.mouse.up()
  const dragged = await sliderValues(blobs)
  expect(dragged.max - dragged.now).toBeGreaterThan(
    0.4 * (dragged.max - dragged.min),
  )
  await page.keyboard.press('End')
  await expect(blobs.pulse).toHaveAttribute('aria-valuetext', 'Live')
})

test("names the day's top posters, and links to the rest in the table", async ({
  blobs,
  page,
}) => {
  await blobs.openLive()
  const label = await blobs.shareStrip.getAttribute('aria-label')
  const projects = Number(/from (\d+) projects$/.exec(label ?? '')?.[1])
  const named = (await posterNames(blobs)).filter((n) => n !== 'Unknown')
  expect(projects, 'projects on the strip and in the table').toBe(named.length)
  await expect(blobs.moreProjects).toHaveText(`+${projects - 4} more`)

  await blobs.page.evaluate(() => scrollTo(0, 0))
  if (blobs.hasTouch) await blobs.moreProjects.tap()
  else await blobs.moreProjects.click()
  await expect(page).toHaveURL(/#live-posters$/)
  // at the top of the screen, once any smooth scroll is done
  await expect
    .poll(async () => {
      const top = (await box(blobs.posters)).y
      return top > -2 && top < page.viewportSize()!.height / 3
    })
    .toBe(true)
})

function range(from: number, to: number, step: number) {
  const values: number[] = []
  for (let value = from; value < to; value += step) values.push(value)
  return values
}

/**
 * Holds the live feed's answers until released, so the page can be seen as
 * it waits. `asked` settles once the belt has asked.
 */
async function holdLiveFeed(page: Page) {
  let release = () => {}
  const released = new Promise<void>((resolve) => {
    release = resolve
  })
  let asked = () => {}
  const askedOnce = new Promise<void>((resolve) => {
    asked = resolve
  })
  await page.route('**/api/trpc/da.liveBlobs**', async (route) => {
    asked()
    await released
    await route.continue()
  })
  return { asked: askedOnce, release }
}

/**
 * Where the live card puts its labels and its parts, from its own top: the
 * charts above it load on their own, and are checked on their own
 */
function liveCardLayout(page: Page) {
  return page.evaluate(() => {
    const card = document.querySelector('dl')!.closest('.primary-card')!
    const [, live, posters] = [...card.children]
    const cardTop = card.getBoundingClientRect().top
    const top = (e: Element) =>
      Math.round(e.getBoundingClientRect().top - cardTop)
    return {
      labels: [...card.querySelectorAll('dt')].map((dt) => ({
        text: dt.firstElementChild?.firstChild?.textContent ?? '',
        x: Math.round(dt.getBoundingClientRect().left),
        y: top(dt),
      })),
      status: top(card.querySelector('[role=status]')!),
      belt: {
        top: top(live!),
        heights: [...live!.children].map((c) =>
          Math.round(c.getBoundingClientRect().height),
        ),
      },
      postersTop: top(posters!),
    }
  })
}

async function sliderValues(blobs: BlobsPage) {
  return blobs.pulse.evaluate((slider) => ({
    now: Number(slider.getAttribute('aria-valuenow')),
    min: Number(slider.getAttribute('aria-valuemin')),
    max: Number(slider.getAttribute('aria-valuemax')),
  }))
}

async function posterNames(blobs: BlobsPage) {
  await expect(blobs.posterRows.first()).toBeVisible()
  return blobs.posterRows.evaluateAll((rows) =>
    rows.map((row) => (row as HTMLTableRowElement).cells[2]!.innerText.trim()),
  )
}

/**
 * Runs in the page before it loads. The belt is a canvas, so its labels are
 * read as it draws them: every frame starts by clearing the canvas, and each
 * label drawn over half opaque is kept with its box until the frame ends,
 * when any two that cross, or one cut by an edge, are noted. A label giving
 * way to another, fading as it shows, is under half opaque by then.
 */
function recordBeltLabels() {
  interface Drawn {
    text: string
    left: number
    right: number
    top: number
    bottom: number
  }
  const seen = {
    overlaps: new Set<string>(),
    cut: new Set<string>(),
    arrivals: 0,
  }
  Object.assign(window, { __beltLabels: seen })
  let frame: Drawn[] = []
  let width = 0

  const isBelt = (ctx: CanvasRenderingContext2D) =>
    ctx.canvas.getAttribute?.('aria-label')?.startsWith('Ethereum blocks')
  const context = CanvasRenderingContext2D.prototype
  const clearRect = context.clearRect
  context.clearRect = function (...args) {
    if (isBelt(this)) {
      endFrame()
      width = this.canvas.width
    }
    return clearRect.apply(this, args)
  }
  const fillText = context.fillText
  context.fillText = function (text, x, y, maxWidth) {
    if (isBelt(this) && this.globalAlpha > 0.5 && text.trim() !== '') {
      const metrics = this.measureText(text)
      const t = this.getTransform()
      const at = { x: t.a * x + t.c * y + t.e, y: t.b * x + t.d * y + t.f }
      frame.push({
        text,
        left: at.x - metrics.actualBoundingBoxLeft * t.a,
        right: at.x + metrics.actualBoundingBoxRight * t.a,
        top: at.y - metrics.actualBoundingBoxAscent * t.d,
        bottom: at.y + metrics.actualBoundingBoxDescent * t.d,
      })
      if (text.startsWith('+')) seen.arrivals++
    }
    return fillText.call(this, text, x, y, maxWidth)
  }

  function endFrame() {
    const pixel = devicePixelRatio
    for (let i = 0; i < frame.length; i++) {
      const a = frame[i]!
      if (a.left < -pixel || a.right > width + pixel) seen.cut.add(a.text)
      for (let j = i + 1; j < frame.length; j++) {
        const b = frame[j]!
        const across = Math.min(a.right, b.right) - Math.max(a.left, b.left)
        const down = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
        if (across > pixel && down > pixel) {
          seen.overlaps.add(`"${a.text}" over "${b.text}"`)
        }
      }
    }
    frame = []
  }
}

function readBeltLabels(page: Page) {
  return page.evaluate(() => {
    const seen = (
      window as unknown as {
        __beltLabels: {
          overlaps: Set<string>
          cut: Set<string>
          arrivals: number
        }
      }
    ).__beltLabels
    return {
      overlaps: [...seen.overlaps],
      cut: [...seen.cut],
      arrivals: seen.arrivals,
    }
  })
}
