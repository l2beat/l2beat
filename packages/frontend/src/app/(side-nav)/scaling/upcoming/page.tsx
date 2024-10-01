import { MainPageCard } from '~/components/main-page-card'
import { SimplePageHeader } from '~/components/simple-page-header'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingUpcomingTable } from './_components/scaling-upcoming-table'

export default function Page() {
  const entries = getScalingUpcomingEntries()
  return (
    <ScalingFilterContextProvider>
      <SimplePageHeader>Upcoming</SimplePageHeader>
      <MainPageCard>
        <ScalingUpcomingTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
