import { BridgesTvlChart } from '~/app/_components/chart/tvl/bridges-tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridge-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesSummaryTables } from './_components/table/bridges-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getBridgesSummaryEntries(),
    await api.bridges.summary.chart.prefetch({
      range: getCookie('bridgesSummaryChartRange'),
    }),
  ])

  return (
    <div className="mb-8">
      <HydrateClient>
        <BridgesFilterContextProvider>
          <BridgesMvpWarning />
          <BridgesTvlChart />
          <HorizontalSeparator className="my-4 md:my-6" />
          <BridgesSummaryTables entries={entries} />
        </BridgesFilterContextProvider>
      </HydrateClient>
    </div>
  )
}
