import { expect, type Page, test } from 'playwright/test'
import { checkDehydrated, type DehydratedResult } from './dehydrated'
import { PAGES, type PageToVerify } from './pages'
import {
  checkNoRefetch,
  type NoRefetchResult,
  type PageWithPrefetch,
} from './trpcRequests'

test.describe.configure({ mode: 'parallel' })

test.describe('tRPC SSR prefetches', () => {
  for (const pageToVerify of PAGES) {
    test(pageToVerify.url, async ({ baseURL, page }) => {
      await verifyPrefetches({ baseURL, page, pageToVerify })
    })
  }
})

async function verifyPrefetches({
  baseURL,
  page,
  pageToVerify,
}: {
  baseURL: string | undefined
  page: Page
  pageToVerify: PageToVerify
}) {
  if (!baseURL) {
    throw new Error('Playwright baseURL is not configured')
  }

  const dehydrated = await checkDehydrated(baseURL, pageToVerify)
  expect(dehydrated.error, formatDehydrated(dehydrated)).toBeUndefined()
  expect(dehydrated.missingExpected, formatDehydrated(dehydrated)).toEqual([])
  expect(
    dehydrated.queries.filter((query) => !query.ok),
    formatDehydrated(dehydrated),
  ).toEqual([])

  const item: PageWithPrefetch = {
    url: dehydrated.url,
    prefetched: dehydrated.queries
      .filter((query) => query.ok)
      .map((query) => ({ path: query.path, input: query.input })),
  }

  const noRefetch = await checkNoRefetch(page, item)
  expect(noRefetch.error, formatNoRefetch(noRefetch)).toBeUndefined()
  expect(noRefetch.refetched, formatNoRefetch(noRefetch)).toEqual([])

  if (noRefetch.mismatched.length > 0) {
    console.warn(formatNoRefetch(noRefetch))
  }
}

function formatDehydrated(result: DehydratedResult): string {
  const lines = [`Dehydrated prefetch check failed for ${result.url}`]
  if (result.error) {
    lines.push(`error: ${result.error}`)
  }
  for (const query of result.queries) {
    lines.push(`${query.ok ? 'OK' : 'FAIL'} ${query.path}: ${query.detail}`)
  }
  for (const path of result.missingExpected) {
    lines.push(`MISSING ${path}: expected but not dehydrated`)
  }
  return lines.join('\n')
}

function formatNoRefetch(result: NoRefetchResult): string {
  const lines = [`Client refetch check failed for ${result.url}`]
  if (result.error) {
    lines.push(`error: ${result.error}`)
  }
  for (const proc of result.refetched) {
    lines.push(`REFETCHED ${proc.path}: exact prefetched key requested on load`)
  }
  for (const proc of result.mismatched) {
    lines.push(
      `MISMATCHED ${proc.path}: fetched with different input than prefetched`,
    )
    lines.push(`prefetched: ${JSON.stringify(proc.prefetchedInput)}`)
    for (const input of proc.observedInputs) {
      lines.push(`client: ${JSON.stringify(input)}`)
    }
  }
  return lines.join('\n')
}
