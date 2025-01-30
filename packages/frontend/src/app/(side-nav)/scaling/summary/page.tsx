import { ScalingSummaryActivityChart } from '~/components/chart/activity/scaling-summary-activity-chart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/scaling-summary-tvs-chart'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ChartTabs } from './_components/chart-tabs'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})

const TIME_RANGE = '1y'
const UNIT = 'usd'

export default async function Page() {
  const [entries] = await Promise.all([
    getScalingSummaryEntries(),
    api.tvs.recategorisedChart.prefetch({
      range: TIME_RANGE,
      excludeAssociatedTokens: false,
      filter: { type: 'layer2' },
      previewRecategorisation: false,
    }),
    api.activity.recategorisedChart.prefetch({
      range: TIME_RANGE,
      filter: { type: 'all' },
      previewRecategorisation: false,
    }),
    api.activity.chartStats.prefetch({
      filter: { type: 'all' },
      previewRecategorisation: false,
    }),
  ])

  return (
    <HydrateClient>
      <MainPageHeader>Summary</MainPageHeader>
      <div className="grid grid-cols-2 gap-4 max-lg:hidden">
        <PrimaryCard>
          <ScalingSummaryTvsChart unit={UNIT} timeRange={TIME_RANGE} />
        </PrimaryCard>
        <PrimaryCard>
          <ScalingSummaryActivityChart timeRange={TIME_RANGE} />
        </PrimaryCard>
      </div>
      <ChartTabs className="lg:hidden" unit={UNIT} timeRange={TIME_RANGE} />
      <ScalingAssociatedTokensContextProvider>
        <ScalingFilterContextProvider>
          <ScalingSummaryTables {...entries} />
        </ScalingFilterContextProvider>
      </ScalingAssociatedTokensContextProvider>
    </HydrateClient>
  )
}
