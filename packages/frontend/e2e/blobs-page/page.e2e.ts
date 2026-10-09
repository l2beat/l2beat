import { box, expect, test } from './blobsPage'
import { findLayoutFaults } from './layoutFaults'

/**
 * The page as a whole, on each screen: every section comes up with nothing
 * logged as an error, nothing is laid out past the screen or over anything
 * else, and the two charts above the belt can both be read.
 */
test.describe.configure({ mode: 'parallel' })

/** Where the charts stand side by side rather than in tabs: Tailwind's lg */
const SIDE_BY_SIDE_FROM = 1200

test('shows every section, logging no errors', async ({ blobs, page }) => {
  const logged: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') logged.push(message.text())
  })
  await blobs.openLive()
  await expect(page).toHaveTitle(/^Blobs/)

  const summary = page
    .locator('.primary-card')
    .filter({ has: page.getByRole('heading', { name: 'Ethereum' }) })
  for (const title of ['Secured by', 'Duration of storage', 'Max throughput']) {
    const stat = summary.getByRole('listitem').filter({ hasText: title })
    await expect(stat).toBeVisible()
    await expect(stat, `${title} has a value`).not.toContainText('—')
  }
  await expect(
    page.getByText('L2s Value Secured').filter({ visible: true }),
  ).toBeVisible()
  await expect(blobs.shareStrip).toBeVisible()
  await expect(blobs.belt).toBeVisible()
  await expect(blobs.pulse).toBeVisible()
  await blobs.posters.scrollIntoViewIfNeeded()
  await expect(blobs.posterRows).not.toHaveCount(0)
  expect(logged).toEqual([])
})

test('fits the screen, with nothing wrapped or run together', async ({
  blobs,
}) => {
  await blobs.openLive()
  await blobs.posters.scrollIntoViewIfNeeded()
  await expect(blobs.posterRows.first()).toBeVisible()
  expect(await findLayoutFaults(blobs.page)).toEqual([])
})

test('fills the charts in without resizing their cards', async ({
  blobs,
  page,
}) => {
  let release = () => {}
  const released = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route(
    /\/api\/trpc\/(tvs|da)\.(chart|projectChart)/,
    async (route) => {
      await released
      await route.continue()
    },
  )
  await blobs.open()
  // the summary and the charts; the live card waits for the belt instead
  const cards = page
    .locator('.primary-card')
    .filter({ visible: true })
    .filter({ hasNot: page.locator('dl') })
  const heights = () =>
    cards.evaluateAll((all) =>
      all.map((card) => Math.round(card.getBoundingClientRect().height)),
    )
  const skeletons = cards.locator('.animate-pulse').filter({ visible: true })
  await expect(skeletons.first()).toBeVisible()
  const waiting = await heights()

  release()
  await expect(skeletons).toHaveCount(0, { timeout: 10_000 })
  expect(await heights()).toEqual(waiting)
})

test('shows both charts, level beside each other where there is room', async ({
  blobs,
  page,
}) => {
  await blobs.open()
  const title = (text: string) =>
    page.getByText(text, { exact: true }).filter({ visible: true })
  const plots = page.locator('.primary-card svg.recharts-surface').filter({
    visible: true,
  })

  if (page.viewportSize()!.width >= SIDE_BY_SIDE_FROM) {
    await expect(title('L2s Value Secured')).toBeVisible()
    await expect(title('Data Posted')).toBeVisible()
    await expect(plots).toHaveCount(2)
    const [tvs, posted] = [await box(plots.nth(0)), await box(plots.nth(1))]
    expect(posted.y, 'the charts start level').toBeCloseTo(tvs.y, 0)
    expect(posted.height, 'and end level').toBeCloseTo(tvs.height, 0)
    return
  }

  // one at a time, a tab each
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(2)
  await expect(title('L2s Value Secured')).toBeVisible()
  await expect(title('Data Posted')).toBeHidden()
  if (blobs.hasTouch) await tabs.nth(1).tap()
  else await tabs.nth(1).click()
  await expect(title('Data Posted')).toBeVisible()
  await expect(title('L2s Value Secured')).toBeHidden()
  await expect(plots).toHaveCount(1)
})

test('asks for the year of every poster only once Per project is chosen', async ({
  blobs,
  page,
}) => {
  const asked: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('da.projectCharts')) asked.push(request.url())
  })
  await blobs.open()
  if (page.viewportSize()!.width < SIDE_BY_SIDE_FROM) {
    await page.getByRole('tab').nth(1).click()
  }
  const view = (name: string) =>
    page.getByRole('radio', { name }).filter({ visible: true })
  await expect(view('Total')).toBeChecked()
  await expect(
    page
      .locator('.primary-card svg.recharts-surface')
      .filter({ visible: true }),
  ).not.toHaveCount(0)
  expect(asked, 'asked for before it is chosen').toEqual([])

  await view('Per project').click()
  await expect(view('Per project')).toBeChecked()
  await expect.poll(() => asked.length).toBe(1)
})
