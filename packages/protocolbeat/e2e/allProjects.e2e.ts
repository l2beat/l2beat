import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { expect, type Page, test } from 'playwright/test'

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

        const listed = page.getByText(`${project} on `).first()
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

function trackNetwork(page: Page) {
  let inFlight = 0
  page.on('request', () => {
    inFlight++
  })
  page.on('requestfinished', () => {
    inFlight--
  })
  page.on('requestfailed', () => {
    inFlight--
  })
  return {
    async waitForQuiet(quietMs: number) {
      const deadline = Date.now() + 30_000
      let quietSince = Date.now()
      while (Date.now() < deadline) {
        if (inFlight > 0) {
          quietSince = Date.now()
        } else if (Date.now() - quietSince >= quietMs) {
          return
        }
        await page.waitForTimeout(20)
      }
      throw new Error(`network still busy after 30s: ${inFlight} in flight`)
    },
  }
}
