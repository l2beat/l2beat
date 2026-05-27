import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { DarkThemeToggle } from '~/components/DarkThemeToggle'
import { Logo } from '~/components/Logo'
import { MobileNavTriggerOpen } from '~/components/nav/mobile/MobileNavTrigger'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { optionToRange } from '~/utils/range/range'
import type { InteropChainWithIcon } from '../interop/components/chain-selector/types'
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
import { OverviewTopInteropProtocolsCard } from './components/OverviewTopInteropProtocolsCard'
import { OverviewWhatsNewCard } from './components/OverviewWhatsNewCard'
import type { OverviewRecentProject } from './getOverviewData'
import type { OverviewProjectCounts } from './getOverviewProjectCounts'
import {
  OVERVIEW_ACTIVITY_CHART_RANGE_ARGS,
  OVERVIEW_DA_CHART_RANGE_ARGS,
  OVERVIEW_TVS_CHART_RANGE_ARGS,
} from './overviewChartRanges'

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
  const tvsChartRange = optionToRange(...OVERVIEW_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...OVERVIEW_ACTIVITY_CHART_RANGE_ARGS,
  )
  const daChartRange = optionToRange(...OVERVIEW_DA_CHART_RANGE_ARGS)

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TvsDisplayControlsContextProvider
          initialValues={{
            excludeAssociatedTokens: false,
            excludeRwaRestrictedTokens: true,
          }}
        >
          <SideNavLayout
            homepageLayout
            contentAreaClassName="max-xl:bg-surface-primary"
          >
            <header className="flex items-center gap-4 pt-[18px] pb-5 max-lg:hidden">
              <a href="/home" aria-label="Go to home">
                <Logo className="h-8 w-auto" />
              </a>
              <div className="h-8 border-divider border-l" />
              <h1 className="font-bold text-[26px]">Home</h1>
              <div className="ml-auto flex shrink-0 items-center gap-4">
                <MobileNavTriggerOpen />
                <DarkThemeToggle />
              </div>
            </header>
            <div className="flex flex-col gap-4 max-md:px-0 md:gap-6">
              <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(260px,300px)_minmax(340px,390px)_minmax(0,1fr)] xl:gap-6 xl:pb-1">
                <div className="flex h-full min-w-0 flex-col gap-4 xl:gap-6">
                  <OverviewStatsStrip
                    counts={projectCounts}
                    variant="overviewRightColumn"
                  />
                  <OverviewWhatsNewCard />
                  <OverviewRecentProjectsCard
                    className="hidden xl:flex"
                    projects={recentProjects}
                  />
                </div>
                <OverviewDeferredMount
                  fallback={<OverviewChartColumnsSkeleton />}
                >
                  <div className="flex h-full min-w-0 flex-col gap-4 xl:gap-6">
                    <OverviewScalingCard
                      tvsRange={tvsChartRange}
                      activityRange={activityChartRange}
                      scalingCategoryCounts={scalingCategoryCounts}
                      compactCharts
                    />
                    <OverviewEthereumCard
                      activityRange={activityChartRange}
                      daRange={daChartRange}
                      compactCharts
                    />
                  </div>
                  <div className="flex h-full min-w-0 flex-col">
                    <OverviewInteropCard
                      interopChains={interopChains}
                      interopProtocols={interopProtocols}
                      defaultSelectedFlowChains={defaultSelectedFlowChains}
                      totalInterop24hVolume={totalInterop24hVolume}
                    />
                  </div>
                </OverviewDeferredMount>
              </div>
              <OverviewDeferredMount fallback={<OverviewTopChainsSkeleton />}>
                <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
                  <OverviewTopChainsCard
                    entries={topChains}
                    chainVolumeMap={chainVolumeMap}
                  />
                  <OverviewTopInteropProtocolsCard
                    interopChains={interopChains}
                    defaultSelectedFlowChains={defaultSelectedFlowChains}
                  />
                </div>
              </OverviewDeferredMount>
              <OverviewRecentProjectsCard
                className="xl:hidden"
                projects={recentProjects}
              />
            </div>
          </SideNavLayout>
        </TvsDisplayControlsContextProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
