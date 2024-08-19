import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridge-summary-entries'
import { api } from '~/trpc/server'
import { getCookie } from '~/utils/cookies/server'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesTvlChart } from './_components/bridges-tvl-chart'
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
      <BridgesFilterContextProvider>
        <BridgesMvpWarning />
        <BridgesTvlChart milestones={[]} />
        <HorizontalSeparator className="my-4 md:my-6" />
        <BridgesSummaryTables entries={entries} />
      </BridgesFilterContextProvider>
    </div>
  )
}
