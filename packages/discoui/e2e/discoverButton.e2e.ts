import { expect, type Page, test } from 'playwright/test'

// One top-bar button starts discovery and stops whatever command is running.
// The discover stream is held open and never answered, so the command stays in
// flight for as long as the test needs and no real discovery touches the
// project files. A fake clock skips the window in which the button ignores a
// repeated activation.

test('discover turns into stop while running, and stop turns it back', async ({
  page,
}) => {
  const discoverRequests = await holdDiscoverStreamOpen(page)
  await page.clock.install()
  await openProject(page)

  await discoverButton(page).click()
  await expect(stopButton(page)).toBeVisible()
  await expect(discoverButton(page)).toBeHidden()
  await expect.poll(() => discoverRequests.count).toEqual(1)

  await page.clock.fastForward(1000)
  await stopButton(page).click()
  await expect(discoverButton(page)).toBeVisible()
  await expect(stopButton(page)).toBeHidden()
})

test('double-clicking discover starts one run and does not stop it', async ({
  page,
}) => {
  const discoverRequests = await holdDiscoverStreamOpen(page)
  await openProject(page)

  await discoverButton(page).dblclick()
  await expect(stopButton(page)).toBeVisible()
  await expect.poll(() => discoverRequests.count).toEqual(1)
})

test('pressing Enter twice starts one run and does not stop it', async ({
  page,
}) => {
  const discoverRequests = await holdDiscoverStreamOpen(page)
  await openProject(page)

  await discoverButton(page).focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')
  await expect(stopButton(page)).toBeVisible()
  await expect.poll(() => discoverRequests.count).toEqual(1)
})

async function holdDiscoverStreamOpen(page: Page) {
  const discoverRequests = { count: 0 }
  await page.route('**/api/terminal/discover?**', () => {
    discoverRequests.count++
  })
  return discoverRequests
}

async function openProject(page: Page) {
  await page.goto('/ui/p/honeypot')
  await expect(page.locator('li[data-address]').first()).toBeVisible({
    timeout: 30_000,
  })
}

function discoverButton(page: Page) {
  return page.getByRole('button', { name: 'Discover', exact: true })
}

function stopButton(page: Page) {
  return page.getByRole('button', { name: 'Stop discovery', exact: true })
}
