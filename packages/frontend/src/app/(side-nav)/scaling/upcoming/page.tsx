import { MainPageHeader } from '~/components/main-page-header'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingUpcomingTables } from './_components/scaling-upcoming-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/upcoming',
  },
})

export default async function Page() {
  const entries = await getScalingUpcomingEntries()
  return (
    <>
      <MainPageHeader>Upcoming</MainPageHeader>
      <ScalingFilterContextProvider>
        <ScalingUpcomingTables {...entries} />
      </ScalingFilterContextProvider>
    </>
  )
}
