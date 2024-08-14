import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'
import { ScalingDataAvailabilityTable } from './_components/table/scaling-da-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/data-availability',
  },
})

export default async function Page() {
  const entries = await getScalingDaEntries()

  return (
    <ScalingFilterContextProvider>
      <div className="mb-8">
        <SimplePageHeader>Data Availability</SimplePageHeader>
      </div>
      <ScalingDataAvailabilityTable entries={entries} />
    </ScalingFilterContextProvider>
  )
}
