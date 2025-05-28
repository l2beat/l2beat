import { getDaSummaryEntries } from 'rewrite/src/server/features/data-availability/summary/get-da-summary-entries'
import { getDaThroughputSummary } from 'rewrite/src/server/features/data-availability/throughput/get-da-throughput-summary'
import { getDefaultMetadata } from '~/utils/metadata'
import { DataAvailabilitySummaryPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/data-availability/summary',
  },
})

export default async function Page() {
  const [{ publicSystems, customSystems }, throughputSummaryData] =
    await Promise.all([getDaSummaryEntries(), getDaThroughputSummary()])

  return (
    <DataAvailabilitySummaryPage
      publicSystems={publicSystems}
      customSystems={customSystems}
      throughputSummaryData={throughputSummaryData}
    />
  )
}
