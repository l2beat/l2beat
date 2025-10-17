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
import { ScalingRwaRestrictedTokensContextProvider } from '../components/ScalingRwaRestrictedTokensContext'
import { ChartTabs } from './components/ChartTabs'
import { ScalingSummaryTables } from './components/ScalingSummaryTables'

export const SCALING_SUMMARY_TIME_RANGE = '1y'
const SCALING_SUMMARY_UNIT = 'usd'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingSummaryEntry>
  queryState: DehydratedState
}

export function ScalingSummaryPage({ entries, queryState, ...props }: Props) {
  const tvsChart = (
    <ScalingSummaryTvsChart
      unit={SCALING_SUMMARY_UNIT}
      timeRange={SCALING_SUMMARY_TIME_RANGE}
    />
  )
  const activityChart = (
    <ScalingSummaryActivityChart timeRange={SCALING_SUMMARY_TIME_RANGE} />
  )

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Summary</MainPageHeader>
          <div className="grid grid-cols-2 gap-4 max-lg:hidden ">
            <PrimaryCard>{tvsChart}</PrimaryCard>
            <PrimaryCard>{activityChart}</PrimaryCard>
          </div>
          <ChartTabs className="lg:hidden" charts={[tvsChart, activityChart]} />
          <ScalingRwaRestrictedTokensContextProvider>
            <ScalingAssociatedTokensContextProvider>
              <TableFilterContextProvider>
                <ScalingSummaryTables {...entries} />
              </TableFilterContextProvider>
            </ScalingAssociatedTokensContextProvider>
          </ScalingRwaRestrictedTokensContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
