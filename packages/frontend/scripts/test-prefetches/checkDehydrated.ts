import { extractSsrData } from './extractSsrData'
import type { PageToVerify } from './pages'

export interface DiscoveredQuery {
  /** Procedure path, e.g. "tvs.recategorisedChart". */
  path: string
  /** Input the server prefetched with (from the dehydrated query key). */
  input: unknown
  status: string
  ok: boolean
  detail: string
}

export interface DehydratedResult {
  url: string
  ok: boolean
  queries: DiscoveredQuery[]
  missingExpected: string[]
  error?: string
}

/**
 * Query key shape from @trpc/tanstack-react-query: [splitPath, { input, type }].
 * Returns the dot-joined procedure path, or undefined if this isn't a tRPC key.
 */
function pathOf(queryKey: unknown): string | undefined {
  if (!Array.isArray(queryKey)) return undefined
  const keyPath = queryKey[0]
  if (!Array.isArray(keyPath) || keyPath.some((p) => typeof p !== 'string')) {
    return undefined
  }
  return keyPath.join('.')
}

function inputOf(queryKey: unknown): unknown {
  if (!Array.isArray(queryKey)) return undefined
  const meta = queryKey[1]
  if (meta && typeof meta === 'object' && 'input' in meta) {
    return (meta as { input: unknown }).input
  }
  return undefined
}

/**
 * Layer 1: discovers and verifies every query the server prefetched for a page.
 * Fetches the page HTML, parses window.__SSR_DATA__, and checks that each
 * dehydrated query has status 'success' with non-null data.
 */
export async function checkDehydrated(
  baseUrl: string,
  page: PageToVerify,
): Promise<DehydratedResult> {
  const { url } = page
  let html: string
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      headers: { 'User-Agent': 'L2Beat-Prefetch-Test/1.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!response.ok) {
      return {
        url,
        ok: false,
        queries: [],
        missingExpected: page.expectedQueries,
        error: `HTTP ${response.status} ${response.statusText}`,
      }
    }
    html = await response.text()
  } catch (error) {
    return {
      url,
      ok: false,
      queries: [],
      missingExpected: page.expectedQueries,
      error: error instanceof Error ? error.message : 'fetch failed',
    }
  }

  try {
    const ssr = extractSsrData(html)
    const dehydrated = ssr.props.queryState?.queries ?? []
    const queries = dehydrated
      .map((q) => {
        const path = pathOf(q.queryKey)
        if (!path) return undefined
        return evaluate(path, inputOf(q.queryKey), q.state)
      })
      .filter((q): q is DiscoveredQuery => q !== undefined)

    const missingExpected = getMissingExpectedQueries(
      page.expectedQueries,
      queries,
    )

    // Failed prefetches are not dehydrated at all (createQueryClient only
    // keeps successes and pendings), so a page whose prefetch threw can show
    // up here with zero queries. Every listed page declares its expected
    // prefetches, so missing expected paths are failures, not vacuous passes.
    if (missingExpected.length > 0) {
      return {
        url,
        ok: false,
        queries,
        missingExpected,
        error:
          'missing expected tRPC queries in dehydrated state (a throwing prefetch is silently dropped from __SSR_DATA__)',
      }
    }

    return {
      url,
      ok: queries.every((q) => q.ok),
      queries,
      missingExpected,
    }
  } catch (error) {
    return {
      url,
      ok: false,
      queries: [],
      missingExpected: page.expectedQueries,
      error: error instanceof Error ? error.message : 'parse failed',
    }
  }
}

function getMissingExpectedQueries(
  expectedQueries: string[],
  discoveredQueries: DiscoveredQuery[],
): string[] {
  const discoveredCounts = new Map<string, number>()
  for (const query of discoveredQueries) {
    discoveredCounts.set(
      query.path,
      (discoveredCounts.get(query.path) ?? 0) + 1,
    )
  }

  const missing: string[] = []
  for (const expected of expectedQueries) {
    const count = discoveredCounts.get(expected) ?? 0
    if (count === 0) {
      missing.push(expected)
      continue
    }
    discoveredCounts.set(expected, count - 1)
  }
  return missing
}

function evaluate(
  path: string,
  input: unknown,
  state: { status: string; data: unknown },
): DiscoveredQuery {
  if (state.status !== 'success') {
    return {
      path,
      input,
      status: state.status,
      ok: false,
      detail: `status '${state.status}'`,
    }
  }
  if (state.data === null || state.data === undefined) {
    return {
      path,
      input,
      status: state.status,
      ok: false,
      detail: 'success but empty data',
    }
  }
  return { path, input, status: state.status, ok: true, detail: 'success' }
}
