import { BridgesTvsChart } from '~/components/chart/tvs/bridges-tvs-chart'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesSummaryTable } from './_components/table/bridges-summary-table'

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
        <BridgesFilterContextProvider>
          <MainPageHeader>Summary</MainPageHeader>
          <BridgesMvpWarning className="md:mb-3" sidebar />
          <PrimaryCard>
            <BridgesTvsChart />
          </PrimaryCard>
          <PrimaryCard className="md:mt-6">
            <BridgesSummaryTable entries={entries} />
          </PrimaryCard>
        </BridgesFilterContextProvider>
      </HydrateClient>
    </>
  )
}
