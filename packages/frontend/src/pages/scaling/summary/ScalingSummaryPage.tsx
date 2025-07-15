import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/ScalingSummaryActivityChart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/ScalingSummaryTvsChart'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ScalingAssociatedTokensContextProvider } from '~/pages/scaling/components/ScalingAssociatedTokensContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { ChartTabs } from './components/ChartTabs'
import { ScalingSummaryTables } from './components/ScalingSummaryTables'

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
          <div className="grid grid-cols-2 gap-4 max-lg:hidden ">
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
