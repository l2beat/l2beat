import { MainPageHeader } from '~/components/main-page-header'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingDaTables } from './_components/scaling-da-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/data-availability',
  },
})

export default async function Page() {
  const entries = await getScalingDaEntries()

  return (
    <>
      <MainPageHeader>Data Availability</MainPageHeader>
      <ScalingFilterContextProvider>
        <ScalingDaTables {...entries} />
      </ScalingFilterContextProvider>
    </>
  )
}
