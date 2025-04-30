import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { ScalingArchivedTables } from './_components/scaling-archived-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingArchivedEntry>
}

export function ScalingArchivedPage({ entries }: Props) {
  return (
    <>
      <MainPageHeader>Archived</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingArchivedTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
