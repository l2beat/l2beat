import { SimplePageHeader } from '~/components/simple-page-header'
import { ScalingUpcomingTable } from './_components/scaling-upcoming-table'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { ScalingFilterContextProvider } from '../../_components/scaling-filter-context'

export default function Page() {
  const entries = getScalingUpcomingEntries()
  return (
    <ScalingFilterContextProvider>
      <SimplePageHeader>Upcoming</SimplePageHeader>
      <ScalingUpcomingTable entries={entries} />
    </ScalingFilterContextProvider>
  )
}
