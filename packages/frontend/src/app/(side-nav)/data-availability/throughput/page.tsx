import { getDaThroughputEntries } from 'rewrite/src/server/features/data-availability/throughput/get-da-throughput-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { DataAvailabilityThroughputPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/data-availability/throughput',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getDaThroughputEntries(),
    api.da.chart.prefetch({ range: '1y', includeScalingOnly: false }),
  ])

  return (
    <HydrateClient>
      <DataAvailabilityThroughputPage entries={entries} />
    </HydrateClient>
  )
}
