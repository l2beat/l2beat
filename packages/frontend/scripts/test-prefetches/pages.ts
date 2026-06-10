import { ps } from '~/server/projects'

export interface PageToVerify {
  url: string
  /** Required tRPC procedure paths that must be present in queryState. */
  expectedQueries: string[]
}

function page(url: string, expectedQueries: string[]): PageToVerify {
  return { url, expectedQueries }
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
const STATIC_PAGES: PageToVerify[] = [
  page('/scaling/summary', [
    'tvs.recategorisedChart',
    'activity.recategorisedChart',
    'tvs.table',
  ]),
  page('/scaling/activity', [
    'activity.recategorisedChart',
    'activity.chartStats',
  ]),
  page('/scaling/costs', ['costs.chart']),
  page('/scaling/tvs', ['tvs.detailedChart', 'tvs.table', 'tvs.chartStats']),
  page('/scaling/projects/arbitrum', [
    'activity.chart',
    'costs.projectChart',
    'da.scalingProjectChart',
    'interop.flows',
    'liveness.projectChart',
  ]),
  page('/scaling/projects/base', [
    'activity.chart',
    'costs.projectChart',
    'da.scalingProjectChart',
    'interop.flows',
    'liveness.projectChart',
  ]),
  page('/data-availability/throughput', ['da.chart']),
  page('/data-availability/projects/ethereum/ethereum', [
    'interop.flows',
    'da.projectCharts',
  ]),
  page('/data-availability/projects/eigenda/eigenda-v2#throughput', [
    'da.projectCharts',
  ]),
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
  page('/privacy/summary', ['privacy.flowsChart', 'privacy.tvlChart']),
  page('/privacy/projects/tornado-cash', [
    'privacy.flowsChart',
    'privacy.tvlChart',
  ]),
]

/**
 * Resolves the full list of page URLs to verify, adding one representative
 * dynamic page per pattern (slugs resolved the same way SitemapRouter does).
 */
export async function resolvePages(): Promise<PageToVerify[]> {
  const [ecosystemProjects, privacyProjects] = await Promise.all([
    ps.getProjects({ where: ['ecosystemConfig'] }),
    ps.getProjects({ where: ['privacyInfo'] }),
  ])

  const pages = [...STATIC_PAGES]

  const ecosystem = ecosystemProjects[0]
  if (ecosystem) {
    pages.push(page(`/ecosystems/${ecosystem.slug}`, ['activity.chart']))
  }

  const privacyProject = privacyProjects[0]
  if (privacyProject) {
    pages.push(
      page(`/privacy/projects/${privacyProject.slug}`, [
        'privacy.flowsChart',
        'privacy.tvlChart',
      ]),
    )
  }

  return pages
}
