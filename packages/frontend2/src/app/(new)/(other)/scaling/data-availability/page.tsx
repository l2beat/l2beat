import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getScalingDaEntries } from '~/server/features/scaling/get-scaling-da-entries'
import { getLatestTvlUsd } from '~/server/features/tvl/get-latest-tvl-usd'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingDataAvailabilityTable } from './_components/table/scaling-da-table'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/data-availability',
  },
})

export default async function Page() {
  const tvl = await getLatestTvlUsd({ type: 'all' })
  const items = await getScalingDaEntries(tvl)

  return (
    <ScalingFilterContextProvider>
      <div className="mb-8">
        <SimplePageHeader>Data Availability</SimplePageHeader>
      </div>
      <ScalingDataAvailabilityTable items={items} />
    </ScalingFilterContextProvider>
  )
}
