import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { L2ArchivedTable } from './table/L2ArchivedTable'

interface Props {
  entries: L2ArchivedEntry[]
}

export function L2ArchivedTableSection(props: Props) {
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
          <L2ArchivedTable entries={entries} />
        </TableSortingProvider>
      </PrimaryCard>
    </>
  )
}
