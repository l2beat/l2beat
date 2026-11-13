import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { L2SummaryActivityChart } from '~/components/chart/activity/L2SummaryActivityChart'
import { L2SummaryTvsChart } from '~/components/chart/tvs/L2SummaryTvsChart'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  type BadgeLookup,
  BadgeLookupProvider,
} from '~/components/projects/BadgeLookup'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { useHomeTheme } from '~/pages/home/useHomeTheme'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2StageTvsShares } from '~/server/features/layer2s/summary/getL2StageTvsShares'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import { optionToRange } from '~/utils/range/range'
import { ChartTabs } from './components/ChartTabs'
import { L2SummaryStageShare } from './components/L2SummaryStageShare'
import { L2SummaryTables } from './components/L2SummaryTables'
import {
  SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  SCALING_SUMMARY_TVS_CHART_RANGE_ARGS,
  SCALING_SUMMARY_UNIT,
} from './l2SummaryConstants'

interface Props extends AppLayoutProps {
  badgeLookup: BadgeLookup
  entries: TabbedL2Entries<L2SummaryEntry>
  stageShares: L2StageTvsShares | undefined
  queryState: DehydratedState
}

export function L2SummaryPage({
  entries,
  stageShares,
  queryState,
  badgeLookup,
  ...props
}: Props) {
  useHomeTheme()
  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )

  const tvsChart = (
    <L2SummaryTvsChart
      unit={SCALING_SUMMARY_UNIT}
      range={tvsChartRange}
      period={SCALING_SUMMARY_TVS_CHART_RANGE_ARGS[0]}
    />
  )
  const activityChart = (
    <L2SummaryActivityChart
      range={activityChartRange}
      period={SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS[0]}
    />
  )

  return (
    <AppLayout {...props}>
      <BadgeLookupProvider lookup={badgeLookup}>
        <HydrationBoundary state={queryState}>
          {/* Home's theme, so the two pages read as one family. */}
          <div className="home-theme contents">
            <SideNavLayout variant="wide">
              <MainPageHeader>Summary</MainPageHeader>
              {/* Below md the two charts share a tabbed card. From md they sit
              side by side with the stages across the page under them, and
              where three columns fit, the stages are the third. */}
              <div className="@container/summary">
                <div className="grid @min-[1400px]/summary:grid-cols-3 grid-cols-1 md:grid-cols-2 md:gap-4 max-md:[&>*+*]:border-divider max-md:[&>*+*]:border-t">
                  <ChartTabs
                    className="md:hidden"
                    charts={[tvsChart, activityChart]}
                  />
                  <PrimaryCard className="min-w-0 max-md:hidden">
                    {tvsChart}
                  </PrimaryCard>
                  <PrimaryCard className="min-w-0 max-md:hidden">
                    {activityChart}
                  </PrimaryCard>
                  {stageShares && (
                    <L2SummaryStageShare
                      shares={stageShares}
                      className="@min-[1400px]/summary:col-span-1 md:col-span-2"
                    />
                  )}
                </div>
              </div>
              <TvsDisplayControlsContextProvider
                initialValues={{
                  excludeAssociatedTokens: false,
                  excludeRwaRestrictedTokens: true,
                }}
              >
                <TableFilterContextProvider>
                  <L2SummaryTables {...entries} />
                </TableFilterContextProvider>
              </TvsDisplayControlsContextProvider>
            </SideNavLayout>
          </div>
        </HydrationBoundary>
      </BadgeLookupProvider>
    </AppLayout>
  )
}
