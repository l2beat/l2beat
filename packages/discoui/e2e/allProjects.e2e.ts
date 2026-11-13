import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { expect, type Page, type Request, test } from 'playwright/test'

const PROJECTS_ROOT = join(__dirname, '../../config/src/projects')
const SHARD_COUNT = 8

const projects = readdirSync(PROJECTS_ROOT)
  .filter((name) => existsSync(join(PROJECTS_ROOT, name, 'discovered.json')))
  .sort()

test.describe.configure({ mode: 'parallel' })
test.setTimeout(5 * 60 * 1000)

test('home page lists every project', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.goto('/ui')
  for (const project of projects) {
    await expect(page.locator(`a[href="/ui/p/${project}"]`)).toBeVisible()
  }
  expect(errors).toEqual([])
})

for (let shard = 0; shard < SHARD_COUNT; shard++) {
  test(`project pages load (${shard + 1}/${SHARD_COUNT})`, async ({ page }) => {
    const errors = collectPageErrors(page)
    const network = trackNetwork(page)
    const shardProjects = projects.filter(
      (_, index) => index % SHARD_COUNT === shard,
    )
    for (const project of shardProjects) {
      await test.step(project, async () => {
        errors.length = 0
        await page.goto(`/ui/p/${project}`)

        const listed = page.getByTitle(`${project} on `).first()
        const failed = page.getByText('Something went wrong').first()
        await expect(listed.or(failed)).toBeVisible({ timeout: 30_000 })
        await network.waitForQuiet(100)

        await expect(failed).toHaveCount(0)
        expect(errors).toEqual([])
      })
    }
  })
}

function collectPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`)
  })
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console.error: ${message.text()}`)
    }
  })
  return errors
}

// An event stream, like the one DiscoUI keeps open for agents, never
// finishes, so it is not part of a page loading.
//
// Chromium reports no end for a request that its page abandons by navigating
// away, so the requests of the page before are dropped when the next one
// arrives, or they would count as in flight forever.
function trackNetwork(page: Page) {
  const inFlight = new Set<Request>()
  const isLoad = (request: Request) => request.resourceType() !== 'eventsource'
  page.on('request', (request) => {
    if (isLoad(request)) inFlight.add(request)
  })
  page.on('requestfinished', (request) => inFlight.delete(request))
  page.on('requestfailed', (request) => inFlight.delete(request))
  page.on('response', (response) => {
    const request = response.request()
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      inFlight.clear()
      inFlight.add(request)
    }
  })
  return {
    async waitForQuiet(quietMs: number) {
      const deadline = Date.now() + 30_000
      let quietSince = Date.now()
      while (Date.now() < deadline) {
        if (inFlight.size > 0) {
          quietSince = Date.now()
        } else if (Date.now() - quietSince >= quietMs) {
          return
        }
        await page.waitForTimeout(20)
      }
      const urlsInFlight = [...inFlight].map((request) => request.url())
      expect(urlsInFlight, 'network still busy after 30s').toEqual([])
    },
  }
}
