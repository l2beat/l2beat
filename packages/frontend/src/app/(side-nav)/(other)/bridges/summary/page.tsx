import { BridgesTvlChart } from '~/components/chart/tvl/bridges-tvl-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesSummaryTable } from './_components/table/bridges-summary-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getBridgesSummaryEntries(),
    api.tvl.chart.prefetch({
      range: getCookie('bridgesSummaryChartRange'),
      filter: { type: 'bridge' },
      excludeAssociatedTokens: false,
    }),
    api.tvl.total.prefetch({
      filter: { type: 'bridge' },
      excludeAssociatedTokens: false,
    }),
  ])

  return (
    <div className="mb-8">
      <HydrateClient>
        <BridgesFilterContextProvider>
          <BridgesTvlChart />
          <HorizontalSeparator className="my-4 md:my-6" />
          <BridgesSummaryTable entries={entries} />
        </BridgesFilterContextProvider>
      </HydrateClient>
    </div>
  )
}
