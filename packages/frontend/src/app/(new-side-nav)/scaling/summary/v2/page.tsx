import { ActivityChartV2 } from '~/components/chart/activity/activity-chart-v2'
import { ScalingTvlChartV2 } from '~/components/chart/tvl/scaling-tvl-chart-v2'
import { MainPageCard } from '~/components/main-page-card'
import { getScalingSummaryEntriesV2 } from '~/server/features/scaling/summary/get-scaling-summary-entries-v2'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../../../../(side-nav)/scaling/_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../../../../(side-nav)/scaling/_components/scaling-filter-context'
import { ScalingSummaryTableV2 } from './_components/scaling-summary-table-v2'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary/v2',
  },
  robots: {
    index: false,
  },
})

const TIME_RANGE = '30d'
const UNIT = 'usd'

export default async function Page() {
  const entries = await getScalingSummaryEntriesV2()

  await api.tvl.chart.prefetch({
    range: TIME_RANGE,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  })

  await api.activity.chart.prefetch({
    range: TIME_RANGE,
    filter: { type: 'all' },
  })
  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <h1 className="my-5 ml-6 text-3xl font-bold">Summary</h1>
          <div className="grid grid-cols-2 gap-4">
            <MainPageCard>
              <ScalingTvlChartV2 unit={UNIT} timeRange={TIME_RANGE} />
            </MainPageCard>
            <MainPageCard>
              <ActivityChartV2 timeRange={TIME_RANGE} />
            </MainPageCard>
          </div>
          <MainPageCard className="mt-6">
            <ScalingSummaryTableV2 entries={entries} />
          </MainPageCard>
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
