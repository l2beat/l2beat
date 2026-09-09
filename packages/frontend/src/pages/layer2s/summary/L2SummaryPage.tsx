import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { L2SummaryActivityChart } from '~/components/chart/activity/L2SummaryActivityChart'
import { L2SummaryTvsChart } from '~/components/chart/tvs/L2SummaryTvsChart'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import { optionToRange } from '~/utils/range/range'
import { ChartTabs } from './components/ChartTabs'
import { L2SummaryTables } from './components/L2SummaryTables'
import {
  SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  SCALING_SUMMARY_TVS_CHART_RANGE_ARGS,
  SCALING_SUMMARY_UNIT,
} from './l2SummaryConstants'

interface Props extends AppLayoutProps {
  entries: TabbedL2Entries<L2SummaryEntry>
  queryState: DehydratedState
}

export function L2SummaryPage({ entries, queryState, ...props }: Props) {
  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )

  const tvsChart = (
    <L2SummaryTvsChart unit={SCALING_SUMMARY_UNIT} range={tvsChartRange} />
  )
  const activityChart = <L2SummaryActivityChart range={activityChartRange} />

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Summary</MainPageHeader>
          <div className="grid grid-cols-2 gap-4 max-lg:hidden">
            <PrimaryCard>{tvsChart}</PrimaryCard>
            <PrimaryCard>{activityChart}</PrimaryCard>
          </div>
          <ChartTabs className="lg:hidden" charts={[tvsChart, activityChart]} />
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
      </HydrationBoundary>
    </AppLayout>
  )
}
