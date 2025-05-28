import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/scaling-summary-activity-chart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/scaling-summary-tvs-chart'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { ScalingAssociatedTokensContextProvider } from '~/pages/scaling/components/scaling-associated-tokens-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { ChartTabs } from './components/chart-tabs'
import { ScalingSummaryTables } from './components/scaling-summary-tables'

export const SCALING_SUMMARY_TIME_RANGE = '1y'
const SCALING_SUMMARY_UNIT = 'usd'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingSummaryEntry>
  queryState: DehydratedState
}

export function ScalingSummaryPage({ entries, queryState, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Summary</MainPageHeader>
          <div className="grid grid-cols-2 gap-4 max-lg:hidden">
            <PrimaryCard>
              <ScalingSummaryTvsChart
                unit={SCALING_SUMMARY_UNIT}
                timeRange={SCALING_SUMMARY_TIME_RANGE}
              />
            </PrimaryCard>
            <PrimaryCard>
              <ScalingSummaryActivityChart
                timeRange={SCALING_SUMMARY_TIME_RANGE}
              />
            </PrimaryCard>
          </div>
          <ChartTabs
            className="lg:hidden"
            unit={SCALING_SUMMARY_UNIT}
            timeRange={SCALING_SUMMARY_TIME_RANGE}
          />
          <ScalingAssociatedTokensContextProvider>
            <TableFilterContextProvider>
              <ScalingSummaryTables {...entries} />
            </TableFilterContextProvider>
          </ScalingAssociatedTokensContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
