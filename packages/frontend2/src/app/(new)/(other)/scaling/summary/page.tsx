import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingTvlChart } from '~/components/chart/tvl/scaling-tvl-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
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
  await api.tvl.chart.prefetch({
    filter: { type: 'layer2' },
    range: getCookie('scalingSummaryChartRange'),
  })

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <ScalingTvlChart milestones={HOMEPAGE_MILESTONES} entries={entries} />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingSummaryTables entries={entries} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
