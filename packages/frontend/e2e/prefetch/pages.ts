export interface PageToVerify {
  url: string
  /** Required tRPC procedure paths that must be present in queryState. */
  expectedQueries: string[]
}

export interface DynamicPageToVerify {
  name: string
  resolve: () => Promise<PageToVerify | undefined>
}

/**
 * Pages to verify. Each page lists the tRPC procedure paths that must be
 * present in the dehydrated queryState. The exact inputs are discovered at
 * runtime and used by Layer 2 to detect hydration regressions.
 *
 * Add a page here when it server-side prefetches tRPC queries. Every listed
 * page should have at least one expected query path; pages without SSR
 * prefetches are not useful for this check.
 */
// /blobs prefetches too, but its live blob feed keeps the network busy, so
// the no-refetch check never sees the page go idle.
export const STATIC_PAGES: PageToVerify[] = [
  page('/', ['interop.dashboard', 'interop.flows']),
  page('/layer2s/summary', [
    'tvs.recategorisedChart',
    'activity.recategorisedChart',
    'tvs.table',
  ]),
  page('/layer2s/activity', [
    'activity.recategorisedChart',
    'activity.chartStats',
  ]),
  page('/layer2s/costs', ['costs.chart']),
  page('/layer2s/tvs', ['tvs.detailedChart', 'tvs.table', 'tvs.chartStats']),
  page('/interop/summary', ['interop.flows']),
  page('/interop/lock-and-mint?from=ethereum&to=arbitrum', [
    'interop.dashboard',
  ]),
  page('/interop/burn-and-mint?from=ethereum&to=arbitrum', [
    'interop.dashboard',
  ]),
  page('/interop/non-minting?from=ethereum&to=arbitrum', ['interop.dashboard']),
  page('/interop/token-frameworks', [
    'interop.tokenFrameworks',
    'interop.tokenFrameworks',
  ]),
  page('/interop/intent-bridges', [
    'interop.intentBridges',
    'interop.intentBridges',
  ]),
  page('/privacy/summary', ['privacy.flowsChart', 'tvs.chartByProjects']),
  page('/layer2s/projects/arbitrum', [
    'tvs.detailedChart',
    'activity.chart',
    'costs.projectChart',
    'da.l2ProjectChart',
    'liveness.projectChart',
  ]),
  page('/projects/ethereum', ['da.projectCharts', 'activity.ethereumChart']),
  page('/zk-catalog/sp1hypercube', ['tvs.detailedChartWithProjectsRanges']),
  page('/ecosystems/superchain', ['tvs.chart', 'activity.chart']),
  page('/publications/monthly-update-2026-08', ['tvs.chart', 'activity.chart']),
  page('/defi/projects/liquityv2', ['defi.tvlChart']),
  page('/privacy/projects/privacy-pools', [
    'tvs.chartByProjects',
    'privacy.anonymitySetChart',
    'privacy.flowsChart',
  ]),
]

export const DYNAMIC_PAGES: DynamicPageToVerify[] = []

/**
 * Resolves the full list of page URLs to verify, adding one representative
 * dynamic page per pattern (slugs resolved the same way SitemapRouter does).
 */
export async function resolvePages(): Promise<PageToVerify[]> {
  const pages = [...STATIC_PAGES]
  for (const dynamicPage of DYNAMIC_PAGES) {
    const resolved = await dynamicPage.resolve()
    if (resolved) {
      pages.push(resolved)
    }
  }
  return pages
}

function page(url: string, expectedQueries: string[]): PageToVerify {
  return { url, expectedQueries }
}
