import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ScalingTvlChart } from '~/components/chart/tvl/scaling-tvl-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingSummaryTable } from './_components/scaling-summary-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getScalingSummaryEntries(),
    api.tvl.chart.prefetch({
      filter: { type: 'layer2' },
      range: getCookie('scalingSummaryChartRange'),
      excludeAssociatedTokens: false,
    }),
    api.tvl.total.prefetch({
      filter: { type: 'layer2' },
      excludeAssociatedTokens: false,
    }),
  ])

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <ScalingTvlChart milestones={HOMEPAGE_MILESTONES} entries={entries} />
          <HorizontalSeparator className="my-4 md:my-6" />
          <ScalingSummaryTable entries={entries} />
        </ScalingAssociatedTokensContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
