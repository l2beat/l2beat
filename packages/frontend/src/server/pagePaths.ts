import { getCollection } from '~/content/getCollection'
import { shouldHaveNoBridgePage } from './features/data-availability/utils/shouldHaveNoBridgePage'
import { ps } from './projects'

type PagePath = `/${string}`

export const STATIC_PAGE_PATHS = [
  '/',
  '/layer2s/summary',
  '/layer2s/activity',
  '/layer2s/risk',
  '/layer2s/risk/state-validation',
  '/layer2s/risk/data-availability',
  '/layer2s/risk/sequencing',
  '/layer2s/tvs',
  '/layer2s/tvs/breakdown',
  '/layer2s/liveness',
  '/layer2s/costs',
  '/layer2s/archived',
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
    layer2sProjects,
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

  for (const project of layer2sProjects) {
    paths.push(`/layer2s/projects/${project.slug}`)
    if (project.tvsConfig) {
      paths.push(`/layer2s/projects/${project.slug}/tvs-breakdown`)
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
