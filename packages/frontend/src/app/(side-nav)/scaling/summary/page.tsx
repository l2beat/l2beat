import { ScalingSummaryActivityChart } from '~/components/chart/activity/scaling-summary-activity-chart'
import { ScalingSummaryTvlChart } from '~/components/chart/tvl/scaling-summary-tvl-chart'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { featureFlags } from '~/consts/feature-flags'
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

const TIME_RANGE = '30d'
const UNIT = 'usd'

export default async function Page() {
  const entries = await getScalingSummaryEntries()

  const tvlChartParams = {
    range: TIME_RANGE,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  } as const
  const activityChartParams = {
    range: TIME_RANGE,
    filter: { type: 'all' },
  } as const

  await Promise.all([
    featureFlags.showOthers
      ? api.tvl.recategorizedChart.prefetch(tvlChartParams)
      : api.tvl.chart.prefetch(tvlChartParams),
    featureFlags.showOthers
      ? api.activity.recategorizedChart.prefetch(activityChartParams)
      : api.activity.chart.prefetch(activityChartParams),
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
      <ScalingAssociatedTokensContextProvider>
        <ScalingFilterContextProvider>
          <ScalingSummaryTables {...entries} />
        </ScalingFilterContextProvider>
      </ScalingAssociatedTokensContextProvider>
    </HydrateClient>
  )
}
