import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getHomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import { getHomeLayer2sCharts } from '~/server/features/home/getHomeLayer2sCharts'
import { getHomeTopChainsTvsData } from '~/server/features/home/getHomeTopChainsTvsData'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { TOP_PROTOCOLS_LIMIT } from '~/server/features/layer2s/interop/utils/pickTopProtocolEntries'
import { getOngoingAnomaliesOverview } from '~/server/features/layer2s/liveness/getOngoingAnomaliesOverview'
import { getLayer2sSummaryData } from '~/server/features/layer2s/summary/getLayer2sSummaryEntries'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
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
import { getHomeProjectCounts } from './getHomeProjectCounts'
import { HOME_CHART_RANGE } from './homeChartRanges'

const TOP_CHAINS_COUNT = 5
const RECENT_PROJECTS_COUNT = 5

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
        title: 'Home - L2BEAT',
        description:
          'Bird-eye view of the Ethereum scaling ecosystem: total value secured, activity, interoperability, recent additions and what L2BEAT is currently tracking.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/summary/opengraph-image.png',
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

  const interopChainsRaw = getInteropChains()
  const interopChains: InteropChainWithIcon[] = interopChainsRaw.map(
    (chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
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
  // refetch. The scaling/ethereum charts and the top chains table are
  // computed server-side into props — they have no client refetch.
  const chartRange = optionToRange(HOME_CHART_RANGE)

  // The flows prefetch needs the protocol list, so it chains off this promise
  // instead of waiting for a separate fetch phase.
  const interopProtocolsPromise = ps.getProjects({ select: ['interopConfig'] })

  const [
    summaryData,
    recentProjects,
    projectCounts,
    interopProtocols,
    recentChanges,
    ongoingAnomalies,
    layer2sCharts,
    ethereumCharts,
  ] = await Promise.all([
    getLayer2sSummaryData(),
    getRecentProjectsForHome(manifest),
    getHomeProjectCounts(),
    interopProtocolsPromise,
    getRecentChangesOverview(),
    getOngoingAnomaliesOverview(),
    getHomeLayer2sCharts(chartRange),
    getHomeEthereumCharts(chartRange),
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
  const layer2sCategoryCounts = {
    rollups: summaryTabs.rollups.length,
    validiumsAndOptimiums: summaryTabs.validiumsAndOptimiums.length,
    others: summaryTabs.others.length,
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
    layer2sCharts,
    ethereumCharts,
    recentProjects,
    interopChains: sortedChains,
    interopProtocols: protocols,
    defaultSelectedFlowChains,
    layer2sCategoryCounts,
    // Only the count is serialized — the groups (full diff bodies) are heavy
    // and fetched lazily via trpc.projects.recentChanges when the dialog opens.
    recentChangesCount: recentChanges.count,
    ongoingAnomalies,
  }
}

export interface HomeRecentProject {
  id: string
  name: string
  href: string
  iconUrl: string
  category: 'layer2s' | 'da' | 'zkCatalog' | 'ecosystems'
  layer2sCategory: string | undefined
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
          href: `/layer2s/projects/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'layer2s' as const,
          layer2sCategory: project.scalingInfo.type,
        }
      }
      if (project.daLayer) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/data-availability/projects/${project.slug}/no-bridge`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'da' as const,
          layer2sCategory: undefined,
        }
      }
      if (project.zkCatalogInfo) {
        return {
          id: project.id.toString(),
          name: project.name,
          href: `/zk-catalog/${project.slug}`,
          iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
          category: 'zkCatalog' as const,
          layer2sCategory: undefined,
        }
      }
      return {
        id: project.id.toString(),
        name: project.name,
        href: `/ecosystems/${project.slug}`,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        category: 'ecosystems' as const,
        layer2sCategory: undefined,
      }
    })
}
