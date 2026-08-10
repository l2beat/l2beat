import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getChangelogEntries,
  selectActiveWhatsNewEntry,
} from '~/server/features/changelog/getChangelogEntries'
import { getDaProjectEconomicSecurity } from '~/server/features/data-availability/project/utils/getDaProjectEconomicSecurity'
import { getHomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import { getHomeScalingCharts } from '~/server/features/home/getHomeScalingCharts'
import { getHomeTopChainsTvsData } from '~/server/features/home/getHomeTopChainsTvsData'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { TOP_PROTOCOLS_LIMIT } from '~/server/features/scaling/interop/utils/pickTopProtocolEntries'
import { getOngoingAnomaliesOverview } from '~/server/features/scaling/liveness/getOngoingAnomaliesOverview'
import { getScalingSummaryData } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { getZkCatalogEntries } from '~/server/features/zk-catalog/getZkCatalogEntries'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import {
  MAX_SELECTED_CHAINS,
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '../interop/components/flows/consts'
import { getInteropChainHref } from '../interop/utils/getInteropChainHref'
import type { HomeScalingCategoryCounts } from './components/HomeScalingCard'
import type { HomeWhatsNewItem } from './components/HomeWhatsNewCard'
import { getHomeProjectCounts } from './getHomeProjectCounts'
import { HOME_CHART_RANGE } from './homeChartRanges'

const TOP_CHAINS_COUNT = 5
const TOP_PRIVACY_PROTOCOLS_COUNT = 5
const TOP_ZK_PROVERS_COUNT = 5
const RECENT_PROJECTS_COUNT = 6

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
          'Bird-eye view of the Ethereum scaling ecosystem: total value secured, activity, interoperability, recent additions and what L2BEAT is currently tracking.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/home/opengraph-image.png',
        },
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

  const scalingProjects = await ps.getProjects({
    select: ['scalingInfo'],
  })
  const scalingProjectSlugById = new Map(
    scalingProjects.map((p) => [p.id, p.slug]),
  )

  const interopChainsRaw = getInteropChains()
  const interopChains: InteropChainWithIcon[] = interopChainsRaw.map(
    (chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
      href: getInteropChainHref(chain.id, scalingProjectSlugById),
    }),
  )
  const activeInteropChains = interopChains.filter((chain) => !chain.isUpcoming)

  const sortedChains: InteropChainWithIcon[] = activeInteropChains.toSorted(
    (a, b) => a.name.localeCompare(b.name),
  )

  const defaultSelectedFlowChains = sortedChains
    .slice(0, MAX_SELECTED_CHAINS)
    .map((chain) => chain.id)

  // The interop prefetch inputs must match the client queries exactly
  // (HomeTopInteropProtocolsCard, HomeInteropCard) so hydration avoids a
  // refetch.
  const chartRange = optionToRange(HOME_CHART_RANGE)

  const interopProtocolsPromise = ps.getProjects({ select: ['interopConfig'] })

  const [
    summaryData,
    recentProjects,
    projectCounts,
    interopProtocols,
    recentChanges,
    ongoingAnomalies,
    scalingCharts,
    ethereumCharts,
    ethereumEconomicSecurity,
    privacyEntries,
    zkCatalogEntries,
  ] = await Promise.all([
    getScalingSummaryData(),
    getRecentProjectsForHome(manifest),
    getHomeProjectCounts(),
    interopProtocolsPromise,
    getRecentChangesOverview(),
    getOngoingAnomaliesOverview(),
    getHomeScalingCharts(chartRange),
    getHomeEthereumCharts(chartRange),
    getEthereumEconomicSecurity(),
    getPrivacyEntriesForHome(),
    getZkCatalogEntries(),
    defaultSelectedFlowChains.length > 0
      ? helpers.queryClient.prefetchQuery(
          helpers.trpc.interop.dashboard.queryOptions({
            from: defaultSelectedFlowChains,
            to: defaultSelectedFlowChains,
            limit: TOP_PROTOCOLS_LIMIT,
          }),
        )
      : undefined,
    interopProtocolsPromise.then((projects) => {
      const protocolIds = projects.map((protocol) => protocol.id)
      if (
        defaultSelectedFlowChains.length < MIN_SELECTED_CHAINS ||
        protocolIds.length < MIN_SELECTED_PROTOCOLS
      ) {
        return
      }
      return helpers.queryClient.prefetchQuery(
        helpers.trpc.interop.flows.queryOptions({
          chains: defaultSelectedFlowChains,
          protocolIds,
        }),
      )
    }),
  ])

  const summaryTabs = summaryData.tabs
  const scalingCategoryCounts: HomeScalingCategoryCounts = {
    rollups: summaryTabs.rollups.length,
    validiumsAndOptimiums: summaryTabs.validiumsAndOptimiums.length,
  }

  const protocols = interopProtocols.map((protocol) => ({
    id: protocol.id,
    name: protocol.interopConfig.name ?? protocol.name,
    slug: protocol.slug,
    iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
  }))

  const topChains = summaryTabs.rollups.slice(0, TOP_CHAINS_COUNT)
  const topChainsTvsData = getHomeTopChainsTvsData(
    topChains,
    summaryData.sevenDayTvsBreakdown,
  )

  return {
    queryState: helpers.dehydrate(),
    projectCounts,
    topChains,
    topChainsTvsData,
    topPrivacyProtocols: privacyEntries.slice(0, TOP_PRIVACY_PROTOCOLS_COUNT),
    topZkProvers: zkCatalogEntries.slice(0, TOP_ZK_PROVERS_COUNT),
    scalingCharts,
    ethereumCharts,
    ethereumEconomicSecurity,
    recentProjects,
    interopChains: sortedChains,
    interopProtocols: protocols,
    defaultSelectedFlowChains,
    scalingCategoryCounts,
    recentChangesCount: recentChanges.count,
    recentChangesProjects: recentChanges.groups.map((group) => ({
      name: group.name,
      iconUrl: group.iconUrl,
    })),
    ongoingAnomalies,
    whatsNewItem: getHomeWhatsNewItem(),
  }
}

async function getPrivacyEntriesForHome() {
  const projects = await ps.getProjects({
    where: ['privacyInfo'],
    select: ['display', 'privacyInfo', 'statuses'],
    optional: [
      'tvsConfig',
      'contracts',
      'permissions',
      'discoveryInfo',
      'zkCatalogInfo',
    ],
  })
  return getPrivacySummaryEntries(projects)
}

async function getEthereumEconomicSecurity(): Promise<number | undefined> {
  const ethereum = await ps.getProject({
    id: ProjectId.ETHEREUM,
    select: ['daLayer'],
  })
  if (!ethereum) {
    return undefined
  }
  return getDaProjectEconomicSecurity(
    ethereum.id,
    ethereum.daLayer.economicSecurity,
  )
}

function getHomeWhatsNewItem(): HomeWhatsNewItem | undefined {
  // The card is a permanent part of the desktop layout, so unlike the
  // floating widget it falls back to the most recent entry when no
  // campaign is currently active.
  const entries = getChangelogEntries()
  const entry =
    selectActiveWhatsNewEntry(entries, new Date()) ??
    entries.find((entry) => entry.whatsNew)
  if (!entry?.whatsNew) {
    return undefined
  }
  return {
    id: `changelog-${entry.id}`,
    title: entry.title,
    description: entry.summary,
    href: entry.whatsNew.href ?? `/changelog#${entry.id}`,
    imageSrc: entry.whatsNew.image,
    verticalImageSrc: entry.whatsNew.verticalImage,
    imageAlt: entry.whatsNew.alt,
  }
}

export interface HomeRecentProject {
  id: string
  name: string
  href: string
  iconUrl: string
  category: 'scaling' | 'da' | 'zkCatalog' | 'ecosystems'
  scalingCategory: string | undefined
}

async function getRecentProjectsForHome(
  manifest: Manifest,
): Promise<HomeRecentProject[]> {
  const projects = await ps.getProjects({
    optional: ['scalingInfo', 'daLayer', 'ecosystemConfig', 'zkCatalogInfo'],
    whereNot: ['archivedAt'],
  })

  return projects
    .filter(
      (project) =>
        project.scalingInfo ||
        project.daLayer ||
        project.ecosystemConfig ||
        project.zkCatalogInfo,
    )
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, RECENT_PROJECTS_COUNT)
    .map((project) => {
      if (project.scalingInfo) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/scaling/projects/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'scaling' as const,
          scalingCategory:
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
          scalingCategory: undefined,
        }
      }
      if (project.zkCatalogInfo) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/zk-catalog/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'zkCatalog' as const,
          scalingCategory: undefined,
        }
      }
      return {
        id: project.id.toString(),
        name: project.name,
        href: `/ecosystems/${project.slug}`,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        category: 'ecosystems' as const,
        scalingCategory: undefined,
      }
    })
}
