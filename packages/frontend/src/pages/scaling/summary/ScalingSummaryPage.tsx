import { UnixTime } from '@l2beat/shared-pure'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/ScalingSummaryActivityChart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/ScalingSummaryTvsChart'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DisplayControlsContextProvider } from '~/components/table/display/DisplayControlsContext'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { optionToRange } from '~/utils/range/range'
import { ChartTabs } from './components/ChartTabs'
import { ScalingSummaryTables } from './components/ScalingSummaryTables'

export const SCALING_SUMMARY_TVS_CHART_RANGE_ARGS = ['1y'] as const
export const SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS = [
  '1y',
  {
    offset: -UnixTime.DAY,
  },
] as const
const SCALING_SUMMARY_UNIT = 'usd'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingSummaryEntry>
  queryState: DehydratedState
}

export function ScalingSummaryPage({ entries, queryState, ...props }: Props) {
  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )

  const tvsChart = (
    <ScalingSummaryTvsChart unit={SCALING_SUMMARY_UNIT} range={tvsChartRange} />
  )
  const activityChart = (
    <ScalingSummaryActivityChart range={activityChartRange} />
  )

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
          <DisplayControlsContextProvider
            initialValues={{
              excludeAssociated: false,
              includeRestrictedRwas: true,
            }}
          >
            <TableFilterContextProvider>
              <ScalingSummaryTables {...entries} />
            </TableFilterContextProvider>
          </DisplayControlsContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
