import type { Project, Stage } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { RosetteValue } from '~/components/rosette/types'
import {
  EMPTY_HOME_ETHEREUM_CHARTS,
  getHomeEthereumCharts,
} from '~/server/features/home/getHomeEthereumCharts'
import {
  EMPTY_HOME_L2_CHARTS,
  getHomeL2Charts,
} from '~/server/features/home/getHomeL2Charts'
import {
  EMPTY_HOME_PRIVACY_DATA,
  getHomePrivacyData,
} from '~/server/features/home/getHomePrivacyData'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import {
  getL2SummaryData,
  type L2SummaryEntry,
} from '~/server/features/layer2s/summary/getL2SummaryEntries'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getOrganizationStructuredData } from '~/ssr/head/structured-data/getOrganizationStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '../interop/components/flows/consts'
import { getFlowChainOrderByVolume } from '../interop/utils/getFlowChainOrderByVolume'
import { getInteropChainHref } from '../interop/utils/getInteropChainHref'
import { mapInteropChainsToWithIcons } from '../interop/utils/mapInteropChainsToWithIcons'
import { selectDefaultFlowChains } from '../interop/utils/selectDefaultFlowChains'
import { toInteropFlowsProtocols } from '../interop/utils/toInteropFlowsProtocols'
import { getHomeCropsProjects } from './getHomeCropsProjects'
import { getHomeProjectCounts } from './getHomeProjectCounts'
import { getHomeResearch } from './getHomeResearch'
import { HOME_CHART_RANGE } from './homeChartRanges'

const TOP_L2_PROJECTS_COUNT = 5
/** Beside the articles new research shows as many as fit, at least five. */
const RECENT_PROJECTS_COUNT = 8

export async function getHomeData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['home', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedData(manifest),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'L2BEAT',
        description:
          'Track the Ethereum ecosystem in one view: Layer 2s, privacy protocols, Ethereum and its interoperability flows, projects evaluated across the CROPS framework, and our latest research.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/home/opengraph-image.png',
        },
        structuredData: () => [getOrganizationStructuredData()],
      }),
    },
    ssr: {
      page: 'HomePage',
      props: {
        ...appLayoutProps,
        ...data,
      },
    },
  }
}

async function getCachedData(manifest: Manifest) {
  const helpers = getSsrHelpers()
  const chartRange = optionToRange(HOME_CHART_RANGE)

  // The sections that read the databases each fall back to empty on their
  // own, so one failing query costs its card, not the page. The rest come
  // from the project config.
  const [
    topL2Projects,
    recentProjects,
    projectCounts,
    recentChanges,
    l2Charts,
    ethereumCharts,
    interop,
    privacy,
    cropsProjects,
  ] = await Promise.all([
    orEmpty(
      'topL2Projects',
      getL2SummaryData().then((summaryData) =>
        getTopL2Projects(
          summaryData.tabs.rollups.slice(0, TOP_L2_PROJECTS_COUNT),
          summaryData.sevenDayTvsBreakdown,
        ),
      ),
      [],
    ),
    getRecentProjectsForHome(manifest),
    getHomeProjectCounts(),
    orEmpty('recentChanges', getRecentChangesOverview(), {
      count: 0,
      groups: [],
    }),
    orEmpty('l2Charts', getHomeL2Charts(chartRange), EMPTY_HOME_L2_CHARTS),
    orEmpty(
      'ethereumCharts',
      getHomeEthereumCharts(chartRange),
      EMPTY_HOME_ETHEREUM_CHARTS,
    ),
    getInteropFlowsForHome(manifest, helpers),
    orEmpty('privacy', getHomePrivacyData(chartRange), EMPTY_HOME_PRIVACY_DATA),
    orEmpty('cropsProjects', getHomeCropsProjects(manifest), []),
  ])

  return {
    queryState: helpers.dehydrate(),
    projectCounts,
    cropsProjects,
    l2Charts,
    topL2Projects,
    privacy,
    ethereumCharts,
    interop,
    recentProjects,
    recentChanges: {
      count: recentChanges.count,
      projects: recentChanges.groups.map((group) => ({
        name: group.name,
        iconUrl: group.iconUrl,
      })),
    },
    research: getHomeResearch(),
  }
}

/**
 * The interop page's own default selection: chains ordered by 24h volume, the
 * top ones selected, every protocol. The flows query is prefetched with exactly
 * what `HomeInteropSection` asks for on the client, so the graph and its
 * stats hydrate instead of refetching.
 */
async function getInteropFlowsForHome(
  manifest: Manifest,
  helpers: ReturnType<typeof getSsrHelpers>,
) {
  const [l2Projects, interopProjects] = await Promise.all([
    ps.getProjects({ select: ['scalingInfo'] }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  const l2ProjectSlugById = new Map(l2Projects.map((p) => [p.id, p.slug]))
  const chains = mapInteropChainsToWithIcons(
    manifest,
    getInteropChains().filter((chain) => !chain.isUpcoming),
  ).map((chain) => ({
    ...chain,
    href: getInteropChainHref(chain, l2ProjectSlugById),
  }))
  const protocols = toInteropFlowsProtocols(manifest, interopProjects)

  const chainIds = chains.map((chain) => chain.id)
  const protocolIds = protocols.map((protocol) => protocol.id)
  // Unordered, the graph still draws; the flows query itself is prefetched,
  // and a failed prefetch only means the client fetches it.
  const order =
    chainIds.length > 0 && protocolIds.length > 0
      ? await orEmpty(
          'interopChainOrder',
          getFlowChainOrderByVolume(chainIds, protocolIds),
          chainIds,
        )
      : chainIds
  const { sortedChains, defaultSelectedFlowChains } = selectDefaultFlowChains(
    chains,
    order,
  )
  if (
    defaultSelectedFlowChains.length >= MIN_SELECTED_CHAINS &&
    protocolIds.length >= MIN_SELECTED_PROTOCOLS
  ) {
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.interop.flows.queryOptions({
        chains: defaultSelectedFlowChains,
        protocolIds,
      }),
    )
  }
  return {
    chains: sortedChains,
    defaultSelectedChains: defaultSelectedFlowChains,
    protocols,
  }
}

export interface HomeTopL2Project {
  id: string
  name: string
  href: string
  iconUrl: string
  stage: Stage | 'UnderReview' | 'NotApplicable'
  tvs: number | undefined
  tvsChange: number | undefined
  /** User operations per second over the past day. */
  uops: number | undefined
  risks: RosetteValue[]
  /** The risk page, this project highlighted. */
  risksHref: string
  risksUnderReview: boolean
}

function getTopL2Projects(
  entries: L2SummaryEntry[],
  breakdown: SevenDayTvsBreakdown,
): HomeTopL2Project[] {
  return entries.map((entry) => {
    const tvs = breakdown.projects[entry.id.toString()]
    return {
      id: entry.id.toString(),
      name: entry.name,
      href: `/layer2s/projects/${entry.slug}`,
      iconUrl: entry.icon,
      stage: entry.stage.stage,
      tvs: tvs?.breakdown.total,
      tvsChange: tvs?.change.total,
      uops: entry.activity?.pastDayUops,
      risks: entry.risks,
      risksHref: `/layer2s/risk?tab=${entry.tab}&highlight=${entry.slug}`,
      risksUnderReview: entry.statuses?.underReview === 'config',
    }
  })
}

export interface HomeRecentProject {
  id: string
  name: string
  href: string
  iconUrl: string
  /** What kind of project it is, e.g. "ZK Rollup" or "Privacy". */
  label: string
}

async function getRecentProjectsForHome(
  manifest: Manifest,
): Promise<HomeRecentProject[]> {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'ecosystemConfig',
      'interopConfig',
      'zkCatalogInfo',
      'privacyInfo',
    ],
    whereNot: ['archivedAt'],
  })

  return projects
    .flatMap((project) => {
      const listing = getRecentProjectListing(project)
      return listing ? [{ project, listing }] : []
    })
    .sort((a, b) => b.project.addedAt - a.project.addedAt)
    .slice(0, RECENT_PROJECTS_COUNT)
    .map(({ project, listing }) => ({
      id: project.id.toString(),
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      ...listing,
    }))
}

/** Where a new project is listed, or nothing for a project we do not list. */
function getRecentProjectListing(
  project: Project<
    never,
    | 'scalingInfo'
    | 'ecosystemConfig'
    | 'interopConfig'
    | 'zkCatalogInfo'
    | 'privacyInfo'
  >,
): Pick<HomeRecentProject, 'name' | 'href' | 'label'> | undefined {
  const { name, slug, scalingInfo } = project
  if (scalingInfo) {
    return {
      name,
      href: `/layer2s/projects/${slug}`,
      label:
        scalingInfo.type === 'Other'
          ? `${scalingInfo.layer === 'layer3' ? 'Layer 3s' : 'Layer 2s'} - Other`
          : (scalingInfo.type ?? 'Scaling project'),
    }
  }
  // Privacy is checked before the ZK Catalog: projects listed in both
  // (e.g. Railgun, Tornado Cash) should surface as privacy projects.
  if (project.privacyInfo) {
    return { name, href: `/privacy/projects/${slug}`, label: 'Privacy' }
  }
  if (project.zkCatalogInfo) {
    return { name, href: `/zk-catalog/${slug}`, label: 'ZK Catalog' }
  }
  if (project.ecosystemConfig) {
    return { name, href: `/ecosystems/${slug}`, label: 'Ecosystem' }
  }
  // Scaling projects that are also interop protocols are handled by the
  // scaling branch, matching the redirect on /interop/protocols/:slug.
  if (project.interopConfig) {
    return {
      name: project.interopConfig.name ?? name,
      href: `/interop/protocols/${slug}`,
      label: 'Interoperability',
    }
  }
}

/** The section's data, or `empty` (logged) when getting it fails. */
async function orEmpty<T>(
  section: string,
  data: Promise<T>,
  empty: T,
): Promise<T> {
  try {
    return await data
  } catch (error) {
    getLogger().error('Home section failed', { section, error })
    return empty
  }
}
