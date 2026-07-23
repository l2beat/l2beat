import { getCollection } from '~/content/getCollection'
import { env } from '~/env'
import { shouldHaveNoBridgePage } from './features/data-availability/utils/shouldHaveNoBridgePage'
import { ps } from './projects'

type PagePath = `/${string}`

export const STATIC_PAGE_PATHS = [
  ...(env.CLIENT_SIDE_HOME_PAGE ? (['/'] as const) : []),
  '/scaling/summary',
  '/scaling/activity',
  '/scaling/risk',
  '/scaling/risk/state-validation',
  '/scaling/risk/data-availability',
  '/scaling/risk/sequencing',
  '/scaling/tvs',
  '/scaling/tvs/breakdown',
  '/scaling/liveness',
  '/scaling/costs',
  '/scaling/archived',
  '/interop/summary',
  '/interop/non-minting',
  '/interop/lock-and-mint',
  '/interop/burn-and-mint',
  '/interop/token-frameworks',
  '/interop/intent-bridges',
  '/data-availability/summary',
  '/data-availability/risk',
  '/data-availability/throughput',
  '/data-availability/liveness',
  '/data-availability/archived',
  '/privacy/summary',
  '/zk-catalog',
  '/governance',
  '/governance/ethereum-connect',
  '/native-rollups',
  '/faq',
  '/about-us',
  '/brand-kit',
  '/changelog',
  '/donate',
  '/glossary',
  '/da-risk-framework',
  '/multisig-report',
  '/terms-of-service',
  '/stages',
  '/publications',
] as const satisfies PagePath[]

export async function getPagePaths(): Promise<PagePath[]> {
  return [...STATIC_PAGE_PATHS, ...(await getDynamicPagePaths())]
}

async function getDynamicPagePaths(): Promise<PagePath[]> {
  const [
    scalingProjects,
    zkCatalogProjects,
    ecosystemProjects,
    daLayers,
    daBridges,
    privacyProjects,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
      optional: ['tvsConfig'],
    }),
    ps.getProjects({ select: ['zkCatalogInfo'] }),
    ps.getProjects({ where: ['ecosystemConfig'] }),
    ps.getProjects({ select: ['daLayer'], whereNot: ['archivedAt'] }),
    ps.getProjects({ select: ['daBridge'] }),
    ps.getProjects({ where: ['privacyInfo'] }),
  ])

  const paths: PagePath[] = []

  for (const project of scalingProjects) {
    paths.push(`/scaling/projects/${project.slug}`)
    if (project.tvsConfig) {
      paths.push(`/scaling/projects/${project.slug}/tvs-breakdown`)
    }
  }

  for (const project of zkCatalogProjects) {
    paths.push(`/zk-catalog/${project.slug}`)
  }

  for (const project of ecosystemProjects) {
    paths.push(`/ecosystems/${project.slug}`)
  }

  for (const project of privacyProjects) {
    paths.push(`/privacy/projects/${project.slug}`)
  }

  for (const layer of daLayers) {
    const layerBridges = daBridges.filter(
      (b) => b.daBridge.daLayer === layer.id,
    )
    for (const bridge of layerBridges) {
      paths.push(`/data-availability/projects/${layer.slug}/${bridge.slug}`)
    }
    if (shouldHaveNoBridgePage(layer.daLayer, layerBridges.length)) {
      paths.push(`/data-availability/projects/${layer.slug}/no-bridge`)
    }
  }

  const governancePublications = getCollection('governance-publications')
  for (const entry of governancePublications) {
    paths.push(`/publications/${entry.id}`)
  }

  const monthlyUpdates = getCollection('monthly-updates')
  for (const entry of monthlyUpdates) {
    paths.push(`/publications/${entry.id}`)
  }

  return paths
}
