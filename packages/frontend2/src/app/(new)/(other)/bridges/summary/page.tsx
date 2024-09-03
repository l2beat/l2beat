import { BridgesTvlChart } from '~/app/_components/chart/tvl/bridges-tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridge-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesSummaryTables } from './_components/table/bridges-summary-tables'

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
    }),
  ])

  return (
    <div className="mb-8">
      <HydrateClient>
        <BridgesFilterContextProvider>
          <BridgesTvlChart />
          <HorizontalSeparator className="my-4 md:my-6" />
          <BridgesSummaryTables entries={entries} />
        </BridgesFilterContextProvider>
      </HydrateClient>
    </div>
  )
}
