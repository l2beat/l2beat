import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { ScalingUpcomingTables } from './_components/scaling-upcoming-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingUpcomingEntry>
}

export function ScalingUpcomingPage({ entries }: Props) {
  return (
    <>
      <MainPageHeader>Upcoming</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingUpcomingTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
