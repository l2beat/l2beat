import type { Page } from 'playwright/test'

/** A query the server actually prefetched (path + the exact input it used). */
export interface PrefetchedKey {
  path: string
  input: unknown
}

export interface PageWithPrefetch {
  url: string
  prefetched: PrefetchedKey[]
}

export interface MismatchedProcedure {
  path: string
  prefetchedInput: unknown
  observedInputs: unknown[]
}

export interface NoRefetchResult {
  url: string
  ok: boolean
  /**
   * Prefetched queries whose EXACT key was requested over the wire on load —
   * hydration failed to serve them. This is the hard-failure signal.
   */
  refetched: PrefetchedKey[]
  /**
   * Prefetched procedures where the client fetched the SAME procedure with a
   * DIFFERENT input than was prefetched. The prefetch may be wasted (the view
   * needs a different key) or the wire call may be an unrelated per-item query.
   * Reported as a non-failing warning for human review.
   */
  mismatched: MismatchedProcedure[]
  /** All tRPC procedures observed during load, for diagnostics. */
  observed: string[]
  error?: string
}

interface TrpcCall {
  path: string
  input: unknown
}

/**
 * Stable, order-independent hash of a value, mirroring how React Query hashes
 * query keys (object keys sorted recursively). Lets us compare a prefetched
 * input to one parsed off the wire.
 */
function stableHash(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          acc[k] = (val as Record<string, unknown>)[k]
          return acc
        }, {})
    }
    return val
  })
}

/**
 * Parses a batched tRPC request URL into its individual (procedure, input)
 * calls, e.g. /api/trpc/privacy.flowsChart,privacy.tvlChart?batch=1&input=...
 * The client uses a JSON.stringify transformer, so each input in the batch's
 * `input` map is itself a JSON string.
 */
function parseCalls(rawUrl: string): TrpcCall[] {
  const url = new URL(rawUrl)
  const match = url.pathname.match(/\/api\/trpc\/(.+)$/)
  if (!match?.[1]) return []
  const paths = decodeURIComponent(match[1])
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)

  let inputMap: Record<string, unknown> = {}
  const inputParam = url.searchParams.get('input')
  if (inputParam) {
    try {
      inputMap = JSON.parse(inputParam)
    } catch {
      inputMap = {}
    }
  }

  return paths.map((path, index) => {
    let input = inputMap[index]
    if (typeof input === 'string') {
      try {
        input = JSON.parse(input)
      } catch {
        // leave as-is
      }
    }
    return { path, input }
  })
}

/**
 * Layer 2: verifies the client serves prefetched queries from the hydrated
 * cache instead of refetching. Loads each page and:
 *  - FAILS if a prefetched query's exact key is requested over the wire
 *    (hydration regression), and
 *  - WARNS if the same procedure is fetched with a different input than
 *    prefetched (possible wasted prefetch).
 */
export async function checkNoRefetch(
  page: Page,
  item: PageWithPrefetch,
): Promise<NoRefetchResult> {
  const { url, prefetched } = item
  const observed = new Map<string, unknown[]>()

  page.on('request', (request) => {
    const reqUrl = request.url()
    if (reqUrl.includes('/api/trpc/')) {
      for (const call of parseCalls(reqUrl)) {
        const inputs = observed.get(call.path) ?? []
        inputs.push(call.input)
        observed.set(call.path, inputs)
      }
    }
  })

  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 45000,
    })
    // Trigger any below-the-fold charts that fetch on becoming visible, then
    // wait for the network to settle again so their requests are observed.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForLoadState('networkidle', { timeout: 15000 })
  } catch (error) {
    return {
      url,
      ok: false,
      refetched: [],
      mismatched: [],
      observed: [...observed.keys()],
      error: error instanceof Error ? error.message : 'navigation failed',
    }
  }

  const refetched: PrefetchedKey[] = []
  const mismatched: MismatchedProcedure[] = []

  for (const key of prefetched) {
    const observedInputs = observed.get(key.path)
    if (!observedInputs || observedInputs.length === 0) continue // served from cache

    const expectedHash = stableHash(key.input)
    if (observedInputs.some((i) => stableHash(i) === expectedHash)) {
      refetched.push(key)
    } else {
      mismatched.push({
        path: key.path,
        prefetchedInput: key.input,
        observedInputs,
      })
    }
  }

  return {
    url,
    ok: refetched.length === 0,
    refetched,
    mismatched,
    observed: [...observed.keys()],
  }
}
