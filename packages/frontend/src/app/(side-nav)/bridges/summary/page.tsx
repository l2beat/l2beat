import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesSummaryPage } from './_page'

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
    <HydrateClient>
      <BridgesSummaryPage entries={entries} />
    </HydrateClient>
  )
}
