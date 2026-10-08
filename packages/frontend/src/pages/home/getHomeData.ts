import type { Stage } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { RosetteValue } from '~/components/rosette/types'
import { getHomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import { getHomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import { getHomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import {
  getL2SummaryData,
  type L2SummaryEntry,
} from '~/server/features/layer2s/summary/getL2SummaryEntries'
import type { SevenDayTvsBreakdown } from '~/server/features/layer2s/tvs/get7dTvsBreakdown'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getOrganizationStructuredData } from '~/ssr/head/structured-data/getOrganizationStructuredData'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '../interop/components/flows/consts'
import type { InteropFlowsProtocol } from '../interop/components/flows/utils/InteropFlowsContext'
import { getFlowChainOrderByVolume } from '../interop/utils/getFlowChainOrderByVolume'
import { getInteropChainHref } from '../interop/utils/getInteropChainHref'
import { selectDefaultFlowChains } from '../interop/utils/selectDefaultFlowChains'
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

  const l2Projects = await ps.getProjects({
    select: ['scalingInfo'],
  })
  const l2ProjectSlugById = new Map(l2Projects.map((p) => [p.id, p.slug]))

  const interopChains: InteropChainWithIcon[] = getInteropChains()
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
      href: getInteropChainHref(chain.id, l2ProjectSlugById),
    }))
  const interopProtocols = await ps.getProjects({ select: ['interopConfig'] })
  const flowProtocols: InteropFlowsProtocol[] = interopProtocols.map(
    (protocol) => ({
      id: protocol.id,
      name: protocol.interopConfig.name ?? protocol.name,
      slug: protocol.slug,
      iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
    }),
  )

  const chartRange = optionToRange(HOME_CHART_RANGE)

  const [
    summaryData,
    recentProjects,
    projectCounts,
    recentChanges,
    l2Charts,
    ethereumCharts,
    interopFlows,
    privacy,
    cropsProjects,
  ] = await Promise.all([
    getL2SummaryData(),
    getRecentProjectsForHome(manifest),
    getHomeProjectCounts(),
    getRecentChangesOverview(),
    getHomeL2Charts(chartRange),
    getHomeEthereumCharts(chartRange),
    getInteropFlowsForHome(interopChains, flowProtocols, helpers),
    getHomePrivacyData(chartRange),
    getHomeCropsProjects(manifest),
  ])

  return {
    queryState: helpers.dehydrate(),
    projectCounts,
    cropsProjects,
    l2Charts,
    topL2Projects: getTopL2Projects(
      summaryData.tabs.rollups.slice(0, TOP_L2_PROJECTS_COUNT),
      summaryData.sevenDayTvsBreakdown,
    ),
    privacy,
    ethereumCharts,
    interopFlowChains: interopFlows.chains,
    interopDefaultFlowChains: interopFlows.defaultSelectedChains,
    flowProtocols,
    recentProjects,
    recentChangesCount: recentChanges.count,
    recentChangesProjects: recentChanges.groups.map((group) => ({
      name: group.name,
      iconUrl: group.iconUrl,
    })),
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
  interopChains: InteropChainWithIcon[],
  protocols: InteropFlowsProtocol[],
  helpers: ReturnType<typeof getSsrHelpers>,
) {
  const chainIds = interopChains.map((chain) => chain.id)
  const protocolIds = protocols.map((protocol) => protocol.id)
  const order =
    chainIds.length > 0 && protocolIds.length > 0
      ? await getFlowChainOrderByVolume(chainIds, protocolIds)
      : chainIds
  const { sortedChains, defaultSelectedFlowChains } = selectDefaultFlowChains(
    interopChains,
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
  category: 'l2' | 'da' | 'interop' | 'zkCatalog' | 'ecosystems' | 'privacy'
  l2Category: string | undefined
}

async function getRecentProjectsForHome(
  manifest: Manifest,
): Promise<HomeRecentProject[]> {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'ecosystemConfig',
      'interopConfig',
      'zkCatalogInfo',
      'privacyInfo',
    ],
    whereNot: ['archivedAt'],
  })

  return projects
    .filter(
      (project) =>
        project.scalingInfo ||
        project.daLayer ||
        project.ecosystemConfig ||
        project.interopConfig ||
        project.zkCatalogInfo ||
        project.privacyInfo,
    )
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, RECENT_PROJECTS_COUNT)
    .map((project) => {
      if (project.scalingInfo) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/layer2s/projects/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'l2' as const,
          l2Category:
            project.scalingInfo.type === 'Other'
              ? `${project.scalingInfo.layer === 'layer3' ? 'Layer 3s' : 'Layer 2s'} - Other`
              : project.scalingInfo.type,
        }
      }
      if (project.daLayer) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/data-availability/projects/${project.slug}/no-bridge`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'da' as const,
          l2Category: undefined,
        }
      }
      // Privacy is checked before the ZK Catalog: projects listed in both
      // (e.g. Railgun, Tornado Cash) should surface as privacy projects.
      if (project.privacyInfo) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/privacy/projects/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'privacy' as const,
          l2Category: undefined,
        }
      }
      if (project.zkCatalogInfo) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/zk-catalog/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'zkCatalog' as const,
          l2Category: undefined,
        }
      }
      if (project.ecosystemConfig) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/ecosystems/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'ecosystems' as const,
          l2Category: undefined,
        }
      }
      // Only interopConfig is left — the filter above guarantees it is set.
      // Scaling projects that are also interop protocols are handled by the
      // 'l2' branch, matching the redirect on /interop/protocols/:slug.
      return {
        id: project.id.toString(),
        name: project.interopConfig?.name ?? project.name,
        href: `/interop/protocols/${project.slug}`,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        category: 'interop' as const,
        l2Category: undefined,
      }
    })
}
