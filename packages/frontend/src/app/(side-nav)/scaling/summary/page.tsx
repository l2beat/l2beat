import { ScalingSummaryActivityChart } from '~/components/chart/activity/scaling-summary-activity-chart'
import { ScalingSummaryTvlChart } from '~/components/chart/tvl/scaling-summary-tvl-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { env } from '~/env'
import {
  type ScalingSummaryEntry,
  getScalingSummaryEntries,
} from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { mapToRecategorisedEntries } from '~/utils/map-to-recategorised-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider, useScalingFilter } from '../_components/scaling-filter-context'
import { ChartTabs } from './_components/chart-tabs'
import { OthersComingSoonNotice } from './_components/table/others-coming-soon-notice'
import { ScalingSummaryRollupsTable } from './_components/table/scaling-summary-rollups-table'
import { ScalingSummaryTable } from './_components/table/scaling-summary-table'
import { ScalingSummaryValidiumsAndOptimiumsTable } from './_components/table/scaling-summary-validiums-and-optimiums-table'
import { ScalingTvlFilters } from '../_components/scaling-tvl-filters'
import { RollupsInfo } from './_components/rollups-info'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { useMemo } from 'react'
import { ScalingSummaryTables } from './_components/tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})

const TIME_RANGE = '30d'
const UNIT = 'usd'

export default async function Page() {
  const entries = await getScalingSummaryEntries()

  await Promise.all([
    api.tvl.chart.prefetch({
      range: TIME_RANGE,
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
    }),
    api.tvl.total.prefetch({
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
    }),
    api.activity.chart.prefetch({
      range: TIME_RANGE,
      filter: { type: 'all' },
    }),
    api.activity.chartStats.prefetch({
      filter: { type: 'all' },
    }),
  ])
  return (
    <HydrateClient>
      <MainPageHeader>Summary</MainPageHeader>
      <div className="grid grid-cols-2 gap-4 max-lg:hidden">
        <MainPageCard>
          <ScalingSummaryTvlChart unit={UNIT} timeRange={TIME_RANGE} />
        </MainPageCard>
        <MainPageCard>
          <ScalingSummaryActivityChart timeRange={TIME_RANGE} />
        </MainPageCard>
      </div>
      <ChartTabs className="lg:hidden" unit={UNIT} timeRange={TIME_RANGE} />
      <HorizontalSeparator className='mb-3 mt-6' />
      <ScalingAssociatedTokensContextProvider>
        <ScalingFilterContextProvider>
          <ScalingSummaryTables {...entries} />
        </ScalingFilterContextProvider>
      </ScalingAssociatedTokensContextProvider>
    </HydrateClient>
  )
}


