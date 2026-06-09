import { extractSsrData } from './extractSsrData'

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
  url: string,
): Promise<DehydratedResult> {
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
        error: `HTTP ${response.status} ${response.statusText}`,
      }
    }
    html = await response.text()
  } catch (error) {
    return {
      url,
      ok: false,
      queries: [],
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

    return {
      url,
      ok: queries.every((q) => q.ok),
      queries,
    }
  } catch (error) {
    return {
      url,
      ok: false,
      queries: [],
      error: error instanceof Error ? error.message : 'parse failed',
    }
  }
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
