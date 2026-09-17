import { expect, test } from 'playwright/test'
import { getPagePaths } from '~/server/pagePaths'
import { PAGE_BUDGETS, resolveBudget } from './budgets'
import { formatPageSize, kb, measurePage } from './measurePage'

test.describe.configure({ mode: 'parallel' })

test.describe('SSR page size budgets', () => {
  for (const [url, budget] of Object.entries(PAGE_BUDGETS)) {
    test(url, async ({ request }) => {
      const size = await measurePage(request, url)
      expect(size.status, formatPageSize(size)).toBe(200)
      expect(size.html, formatPageSize(size)).toBeLessThanOrEqual(budget)
    })
  }

  test('every configured page stays under its category ceiling', async ({
    request,
  }) => {
    test.setTimeout(5 * 60 * 1000)
    const urls = (await getPagePaths()).filter((url) => !(url in PAGE_BUDGETS))
    const failures: string[] = []

    let next = 0
    async function worker() {
      while (next < urls.length) {
        const url = urls[next++]
        if (!url) return
        const size = await measurePage(request, url)
        const { name, budget } = resolveBudget(url)
        if (size.status !== 200 || size.html > budget) {
          failures.push(
            `${formatPageSize(size)} [${name} budget ${kb(budget)}]`,
          )
        }
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker))

    expect(failures, failures.join('\n')).toEqual([])
  })
})
