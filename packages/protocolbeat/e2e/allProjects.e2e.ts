import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { expect, type Page, test } from 'playwright/test'

const PROJECTS_ROOT = join(__dirname, '../../config/src/projects')

const projects = readdirSync(PROJECTS_ROOT)
  .filter((name) => existsSync(join(PROJECTS_ROOT, name, 'discovered.json')))
  .sort()

test.describe.configure({ mode: 'parallel' })

test('home page lists every project', async ({ page }) => {
  const errors = collectPageErrors(page)
  await page.goto('/ui')
  for (const project of projects) {
    await expect(page.locator(`a[href="/ui/p/${project}"]`)).toBeVisible()
  }
  expect(errors).toEqual([])
})

for (const project of projects) {
  test(project, async ({ page }) => {
    const errors = collectPageErrors(page)
    await page.goto(`/ui/p/${project}`)

    const listed = page.getByText(`${project} on `).first()
    const failed = page.getByText('Something went wrong').first()
    await expect(listed.or(failed)).toBeVisible({ timeout: 30_000 })
    await page.waitForLoadState('networkidle')

    await expect(failed).toHaveCount(0)
    expect(errors).toEqual([])
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
