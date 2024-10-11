import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
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
      <MainPageHeader>Data Availability</MainPageHeader>
      <MainPageCard>
        <ScalingDataAvailabilityTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
