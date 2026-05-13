import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { optionToRange } from '~/utils/range/range'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
import {
  SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  SCALING_SUMMARY_TVS_CHART_RANGE_ARGS,
} from '../scaling/summary/scalingSummaryConstants'
import { OverviewEthereumCard } from './components/OverviewEthereumCard'
import { OverviewInteropCard } from './components/OverviewInteropCard'
import { OverviewRecentProjectsCard } from './components/OverviewRecentProjectsCard'
import { OverviewScalingCard } from './components/OverviewScalingCard'
import { OverviewStatsStrip } from './components/OverviewStatsStrip'
import { OverviewTopChainsCard } from './components/OverviewTopChainsCard'
import { OverviewWhatsNewCard } from './components/OverviewWhatsNewCard'
import type { OverviewRecentProject } from './getOverviewData'
import type { OverviewProjectCounts } from './getOverviewProjectCounts'

interface InteropProtocol {
  id: string
  name: string
  iconUrl: string
}

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  projectCounts: OverviewProjectCounts
  topChains: ScalingSummaryEntry[]
  recentProjects: OverviewRecentProject[]
  interopChains: InteropChainWithIcon[]
  interopProtocols: InteropProtocol[]
  defaultSelectedFlowChains: string[]
  totalInterop24hVolume: number
  chainVolumeMap: Record<string, number>
  scalingCategoryCounts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
}

export function OverviewPage({
  queryState,
  projectCounts,
  topChains,
  recentProjects,
  interopChains,
  interopProtocols,
  defaultSelectedFlowChains,
  totalInterop24hVolume,
  chainVolumeMap,
  scalingCategoryCounts,
  ...props
}: Props) {
  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TvsDisplayControlsContextProvider
          initialValues={{
            excludeAssociatedTokens: false,
            excludeRwaRestrictedTokens: true,
          }}
        >
          <SideNavLayout maxWidth="wide">
            <MainPageHeader>Overview</MainPageHeader>
            <div className="flex flex-col gap-4 max-md:px-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
                <OverviewEthereumCard
                  activityRange={activityChartRange}
                  daRange={activityChartRange}
                />
                <OverviewStatsStrip counts={projectCounts} />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
                <OverviewScalingCard
                  tvsRange={tvsChartRange}
                  activityRange={activityChartRange}
                  scalingCategoryCounts={scalingCategoryCounts}
                />
                <OverviewWhatsNewCard />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
                <OverviewTopChainsCard
                  entries={topChains}
                  chainVolumeMap={chainVolumeMap}
                />
                <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
                  <OverviewInteropCard
                    interopChains={interopChains}
                    interopProtocols={interopProtocols}
                    defaultSelectedFlowChains={defaultSelectedFlowChains}
                    totalInterop24hVolume={totalInterop24hVolume}
                  />
                </div>
                <OverviewRecentProjectsCard projects={recentProjects} />
              </div>
            </div>
          </SideNavLayout>
        </TvsDisplayControlsContextProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
