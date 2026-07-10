import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/getScalingArchivedEntries'
import { ScalingArchivedTable } from './table/ScalingArchivedTable'

interface Props {
  entries: ScalingArchivedEntry[]
}

export function ScalingArchivedTableSection(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = props.entries.filter(filterEntries)

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <TableFilters
        className="max-md:mt-4 max-md:px-4"
        entries={props.entries}
      />
      <PrimaryCard className="mt-4">
        <TableSortingProvider initialSort={initialSort}>
          <ScalingArchivedTable entries={entries} />
        </TableSortingProvider>
      </PrimaryCard>
    </>
  )
}
