import { ps } from '~/server/projects'

/**
 * Pages to verify. You only list URLs here — the prefetched procedures are
 * discovered automatically from each page's dehydrated queryState at runtime
 * (see checkDehydrated.ts), so there is no per-procedure config to maintain.
 *
 * Add a page here when it server-side prefetches tRPC queries.
 */
const STATIC_PAGES = [
  '/scaling/summary',
  '/scaling/activity',
  '/scaling/costs',
  '/scaling/tvs',
  '/scaling/projects/arbitrum',
  '/scaling/projects/base',
  '/data-availability/throughput',
  '/data-availability/projects/ethereum/ethereum',
  '/data-availability/projects/eigenda/eigenda-v2#throughput',
  '/zk-catalog/sp1turbo',
  '/interop/summary',
  '/interop/lock-and-mint',
  '/interop/burn-and-mint',
  '/interop/non-minting',
  '/interop/token-frameworks',
  '/interop/protocols/relay',
  '/privacy/summary',
  '/privacy/projects/tornado-cash',
]

/**
 * Resolves the full list of page URLs to verify, adding one representative
 * dynamic page per pattern (slugs resolved the same way SitemapRouter does).
 */
export async function resolvePages(): Promise<string[]> {
  const [ecosystemProjects, privacyProjects] = await Promise.all([
    ps.getProjects({ where: ['ecosystemConfig'] }),
    ps.getProjects({ where: ['privacyInfo'] }),
  ])

  const pages = [...STATIC_PAGES]

  const ecosystem = ecosystemProjects[0]
  if (ecosystem) {
    pages.push(`/ecosystems/${ecosystem.slug}`)
  }

  const privacyProject = privacyProjects[0]
  if (privacyProject) {
    pages.push(`/privacy/projects/${privacyProject.slug}`)
  }

  return pages
}
