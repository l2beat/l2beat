import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingUpcomingTable } from './_components/table/scaling-upcoming-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/upcoming',
  },
})

export default function Page() {
  const entries = getScalingUpcomingEntries()
  return (
    <ScalingFilterContextProvider>
      <MainPageHeader>Upcoming</MainPageHeader>
      <MainPageCard>
        <ScalingUpcomingTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
