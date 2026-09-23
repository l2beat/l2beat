import { UnixTime } from '@l2beat/shared-pure'
import { getCollection } from '~/content/getCollection'
import { env } from '~/env'
import {
  GARDEN_PATH,
  INTEGRATE_CROPS_PATH,
  SUBMIT_PROTOCOL_PATH,
} from '~/pages/garden/paths'
import { shouldHaveNoBridgePage } from './features/data-availability/utils/shouldHaveNoBridgePage'
import { getProjectLastModified, newestTimestamp } from './lastModified'
import { ps } from './projects'

type PagePath = `/${string}`

export interface Page {
  path: PagePath
  /** Absent when the page has no data of its own to date it by. */
  lastModified?: UnixTime
}

export const STATIC_PAGE_PATHS = [
  ...(env.CLIENT_SIDE_HOME_PAGE ? (['/'] as const) : []),
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

export async function getPages(): Promise<Page[]> {
  const paths: PagePath[] = [...STATIC_PAGE_PATHS]
  if (env.CLIENT_SIDE_COMPARE_PROJECTS) {
    paths.push('/layer2s/compare')
  }
  if (env.CLIENT_SIDE_DEFI_ENABLED) {
    paths.push('/defi/summary')
  }
  if (env.CLIENT_SIDE_GARDEN_ENABLED) {
    paths.push(GARDEN_PATH, SUBMIT_PROTOCOL_PATH, INTEGRATE_CROPS_PATH)
  }
  return [...paths.map((path) => ({ path })), ...(await getDynamicPages())]
}

async function getDynamicPages(): Promise<Page[]> {
  const [
    l2Projects,
    zkCatalogProjects,
    ecosystemProjects,
    daLayers,
    daBridges,
    privacyProjects,
    defiProjects,
  ] = await Promise.all([
    ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
      optional: ['tvsConfig', 'discoveryUpdates'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
      optional: ['discoveryUpdates'],
    }),
    ps.getProjects({
      where: ['ecosystemConfig'],
      optional: ['discoveryUpdates'],
    }),
    ps.getProjects({
      select: ['daLayer'],
      whereNot: ['archivedAt'],
      optional: ['discoveryUpdates'],
    }),
    ps.getProjects({ select: ['daBridge'], optional: ['discoveryUpdates'] }),
    ps.getProjects({
      where: ['privacyInfo'],
      optional: ['discoveryUpdates'],
    }),
    env.CLIENT_SIDE_DEFI_ENABLED
      ? ps.getProjects({
          where: ['defiInfo'],
          optional: ['discoveryUpdates'],
        })
      : Promise.resolve([]),
  ])

  const pages: Page[] = [
    ...l2Projects.map(projectPage('/layer2s/projects')),
    ...l2Projects
      .filter((project) => project.tvsConfig)
      .map(projectPage('/layer2s/projects', '/tvs-breakdown')),
    ...zkCatalogProjects.map(projectPage('/zk-catalog')),
    ...ecosystemProjects.map(projectPage('/ecosystems')),
    ...privacyProjects.map(projectPage('/privacy/projects')),
    ...defiProjects.map(projectPage('/defi/projects')),
  ]

  for (const layer of daLayers) {
    const layerLastModified = getProjectLastModified(layer)
    const layerBridges = daBridges.filter(
      (b) => b.daBridge.daLayer === layer.id,
    )
    for (const bridge of layerBridges) {
      pages.push({
        path: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
        // The page shows both the layer and the bridge.
        lastModified: newestTimestamp([
          layerLastModified,
          getProjectLastModified(bridge),
        ]),
      })
    }
    if (shouldHaveNoBridgePage(layer.daLayer, layerBridges.length)) {
      pages.push({
        path: `/data-availability/projects/${layer.slug}/no-bridge`,
        lastModified: layerLastModified,
      })
    }
  }

  const publications = [
    ...getCollection('governance-publications'),
    ...getCollection('monthly-updates'),
  ]
  for (const entry of publications) {
    pages.push({
      path: `/publications/${entry.id}`,
      lastModified: UnixTime.fromDate(entry.data.publishedOn),
    })
  }

  return pages
}

function projectPage(prefix: PagePath, suffix = '') {
  return (
    project: Parameters<typeof getProjectLastModified>[0] & { slug: string },
  ): Page => ({
    path: `${prefix}/${project.slug}${suffix}`,
    lastModified: getProjectLastModified(project),
  })
}
