import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingSummaryTvlChart } from '~/app/_components/chart/tvl/scaling-summary-tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingAssociatedTokensContextProvider } from '../../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
  robots: {
    index: false,
  },
})

export default async function Page() {
  const entries = await getScalingSummaryEntries()

  await api.scaling.summary.chart.prefetch({
    excludeAssociatedTokens: false,
    range: getCookie('scalingSummaryChartRange'),
    type: 'layer2',
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <ScalingSummaryTvlChart
            milestones={HOMEPAGE_MILESTONES}
            entries={entries}
          />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingSummaryTables entries={entries} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
