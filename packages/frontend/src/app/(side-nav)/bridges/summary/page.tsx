import { BridgesTvsChart } from '~/components/chart/tvs/bridges-tvs-chart'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesHeader } from '../_components/bridges-header'
import { BridgesSummaryTables } from './_components/bridges-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getBridgesSummaryEntries(),
    api.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'bridge' },
      excludeAssociatedTokens: false,
    }),
  ])

  return (
    <>
      <HydrateClient>
        <TableFilterContextProvider>
          <BridgesHeader>Summary</BridgesHeader>
          <PrimaryCard>
            <BridgesTvsChart />
          </PrimaryCard>
          <BridgesSummaryTables {...entries} />
        </TableFilterContextProvider>
      </HydrateClient>
    </>
  )
}
