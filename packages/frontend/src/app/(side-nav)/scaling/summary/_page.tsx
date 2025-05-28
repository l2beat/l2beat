import type { ScalingSummaryEntry } from 'rewrite/src/server/features/scaling/summary/get-scaling-summary-entries'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/scaling-summary-activity-chart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/scaling-summary-tvs-chart'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { ChartTabs } from './_components/chart-tabs'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingSummaryEntry>
}

export const SCALING_SUMMARY_TIME_RANGE = '1y'
const SCALING_SUMMARY_UNIT = 'usd'

export function ScalingSummaryPage({ entries }: Props) {
  return (
    <>
      <MainPageHeader>Summary</MainPageHeader>
      <div className="grid grid-cols-2 gap-4 max-lg:hidden">
        <PrimaryCard>
          <ScalingSummaryTvsChart
            unit={SCALING_SUMMARY_UNIT}
            timeRange={SCALING_SUMMARY_TIME_RANGE}
          />
        </PrimaryCard>
        <PrimaryCard>
          <ScalingSummaryActivityChart timeRange={SCALING_SUMMARY_TIME_RANGE} />
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
    </>
  )
}
