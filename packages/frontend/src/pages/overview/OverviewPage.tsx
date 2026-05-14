import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DarkThemeToggle } from '~/components/DarkThemeToggle'
import { Logo } from '~/components/Logo'
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
import {
  OverviewChartColumnsSkeleton,
  OverviewDeferredMount,
  OverviewTopChainsSkeleton,
} from './components/OverviewDeferredMount'
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
          <SideNavLayout homepageLayout>
            <header className="flex items-center gap-4 pt-[18px] pb-5 max-lg:hidden">
              <a href="/home" aria-label="Go to home">
                <Logo className="h-8 w-auto" />
              </a>
              <div className="h-8 border-divider border-l" />
              <h1 className="font-bold text-[26px]">Home</h1>
              <div className="ml-auto shrink-0">
                <DarkThemeToggle />
              </div>
            </header>
            <div className="flex flex-col gap-4 max-md:px-0 md:gap-6">
              <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(260px,300px)_minmax(340px,390px)_minmax(0,1fr)] xl:gap-6">
                <div className="flex min-w-0 flex-col gap-4 xl:h-full xl:justify-between">
                  <OverviewStatsStrip
                    counts={projectCounts}
                    variant="overviewRightColumn"
                  />
                  <OverviewWhatsNewCard />
                  <OverviewRecentProjectsCard projects={recentProjects} />
                </div>
                <OverviewDeferredMount
                  fallback={<OverviewChartColumnsSkeleton />}
                >
                  <>
                    <div className="flex min-w-0 flex-col gap-4 xl:gap-6">
                      <OverviewEthereumCard
                        activityRange={activityChartRange}
                        daRange={activityChartRange}
                        compactCharts
                      />
                      <OverviewScalingCard
                        tvsRange={tvsChartRange}
                        activityRange={activityChartRange}
                        scalingCategoryCounts={scalingCategoryCounts}
                        compactCharts
                      />
                    </div>
                    <div className="min-w-0">
                      <OverviewInteropCard
                        interopChains={interopChains}
                        interopProtocols={interopProtocols}
                        defaultSelectedFlowChains={defaultSelectedFlowChains}
                        totalInterop24hVolume={totalInterop24hVolume}
                      />
                    </div>
                  </>
                </OverviewDeferredMount>
              </div>
              <OverviewDeferredMount fallback={<OverviewTopChainsSkeleton />}>
                <OverviewTopChainsCard
                  entries={topChains}
                  chainVolumeMap={chainVolumeMap}
                />
              </OverviewDeferredMount>
            </div>
          </SideNavLayout>
        </TvsDisplayControlsContextProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
