import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import { type Manifest, manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import { MAX_SELECTED_CHAINS } from '../interop/components/flows/consts'
import {
  SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  SCALING_SUMMARY_TVS_CHART_RANGE_ARGS,
} from '../scaling/summary/scalingSummaryConstants'
import { getOverviewProjectCounts } from './getOverviewProjectCounts'

const TOP_CHAINS_COUNT = 5
const RECENT_PROJECTS_COUNT = 6

export async function getOverviewData(
  req: Request,
  manifestArg: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['overview', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getCachedData,
    ),
  ])

  return {
    head: {
      manifest: manifestArg,
      metadata: getMetadata(manifestArg, {
        title: 'Overview - L2BEAT',
        description:
          'Bird-eye view of the Ethereum scaling ecosystem: total value secured, activity, interoperability, recent additions and what L2BEAT is currently tracking.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/scaling/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'OverviewPage',
      props: {
        ...appLayoutProps,
        ...data,
      },
    },
  }
}

async function getCachedData() {
  const helpers = getSsrHelpers()

  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )

  const interopChainsRaw = getInteropChains()
  const interopChains: InteropChainWithIcon[] = interopChainsRaw.map(
    (chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }),
  )
  const activeInteropChains = interopChains.filter((chain) => !chain.isUpcoming)

  const [summaryTabs, recentProjects, projectCounts, interopProtocols] =
    await Promise.all([
      getScalingSummaryEntries(),
      getRecentProjectsForOverview(),
      getOverviewProjectCounts(),
      ps.getProjects({ select: ['interopConfig'] }),
      helpers.tvs.recategorisedChart.prefetch({
        range: tvsChartRange,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
        filter: { type: 'layer2' },
      }),
      helpers.activity.recategorisedChart.prefetch({
        range: activityChartRange,
        filter: { type: 'all' },
      }),
      helpers.activity.ethereumChart.prefetch({
        range: activityChartRange,
      }),
      helpers.da.projectCharts.prefetch({
        projectId: 'ethereum',
        range: activityChartRange,
        includeScalingOnly: false,
      }),
      helpers.tvs.table.prefetch({
        type: 'rollups',
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ])

  const scalingCategoryCounts = {
    rollups: summaryTabs.rollups.length,
    validiumsAndOptimiums: summaryTabs.validiumsAndOptimiums.length,
    others: summaryTabs.others.length,
  }

  const protocols = interopProtocols.map((protocol) => ({
    id: protocol.id,
    name: protocol.interopConfig.name ?? protocol.name,
    iconUrl: manifest.getUrl(`/icons/${protocol.slug}.png`),
  }))

  const initialFlowsChainIds = activeInteropChains
    .slice(0, MAX_SELECTED_CHAINS)
    .map((chain) => chain.id)
  const flowsData = await helpers.interop.flows.fetch({
    chains: initialFlowsChainIds,
    protocolIds: protocols.map((protocol) => protocol.id),
  })

  const chainsByVolume = flowsData.chainData
    .toSorted((a, b) => b.totalVolume - a.totalVolume)
    .map((chain) => chain.chainId)

  const activeChainsById = new Map(
    activeInteropChains.map((chain) => [chain.id, chain]),
  )
  const sortedChains: InteropChainWithIcon[] =
    chainsByVolume.length > 0
      ? chainsByVolume
          .map((chainId) => activeChainsById.get(chainId))
          .filter((chain): chain is InteropChainWithIcon => chain !== undefined)
      : activeInteropChains

  const defaultSelectedFlowChains = sortedChains
    .slice(0, MAX_SELECTED_CHAINS)
    .map((chain) => chain.id)

  const totalInterop24hVolume = flowsData.flows.reduce(
    (acc, flow) => acc + flow.volume,
    0,
  )

  const chainVolumeMap: Record<string, number> = Object.fromEntries(
    flowsData.chainData.map((chain) => [chain.chainId, chain.totalVolume]),
  )

  const topChains = summaryTabs.rollups.slice(0, TOP_CHAINS_COUNT)

  return {
    queryState: helpers.dehydrate(),
    projectCounts,
    topChains,
    recentProjects,
    interopChains: sortedChains,
    interopProtocols: protocols,
    defaultSelectedFlowChains,
    totalInterop24hVolume,
    chainVolumeMap,
    scalingCategoryCounts,
  }
}

export interface OverviewRecentProject {
  id: string
  name: string
  href: string
  iconUrl: string
  category: 'scaling' | 'da' | 'zkCatalog' | 'ecosystems'
  scalingCategory: string | undefined
}

async function getRecentProjectsForOverview(): Promise<
  OverviewRecentProject[]
> {
  const projects = await ps.getProjects({
    optional: ['scalingInfo', 'daLayer', 'ecosystemConfig', 'zkCatalogInfo'],
    whereNot: ['isUpcoming', 'archivedAt'],
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
          scalingCategory: project.scalingInfo.type,
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
