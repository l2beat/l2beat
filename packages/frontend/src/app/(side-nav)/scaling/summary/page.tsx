import { SummaryActivityChart } from '~/components/chart/activity/summary-activity-chart'
import { ScalingTvlChart } from '~/components/chart/tvl/scaling-tvl-chart'
import { MainPageCard } from '~/components/main-page-card'
import { SimplePageHeader } from '~/components/simple-page-header'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ChartTabs } from './_components/chart-tabs'
import { ScalingSummaryTable } from './_components/table/scaling-summary-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})

const TIME_RANGE = '30d'
const UNIT = 'usd'

export default async function Page() {
  const entries = await getScalingSummaryEntries()

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
          <SimplePageHeader>Summary</SimplePageHeader>
          <div className="grid grid-cols-2 gap-4 max-lg:hidden">
            <MainPageCard>
              <ScalingTvlChart unit={UNIT} timeRange={TIME_RANGE} />
            </MainPageCard>
            <MainPageCard>
              <SummaryActivityChart timeRange={TIME_RANGE} />
            </MainPageCard>
          </div>
          <ChartTabs
            className="md:mt-5 lg:hidden"
            unit={UNIT}
            timeRange={TIME_RANGE}
          />
          <MainPageCard className="mt-6">
            <ScalingSummaryTable entries={entries} />
          </MainPageCard>
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
