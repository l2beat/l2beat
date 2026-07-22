import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { Layer2sArchivedEntry } from '~/server/features/layer2s/archived/getLayer2sArchivedEntries'
import { Layer2sArchivedTable } from './table/Layer2sArchivedTable'

interface Props {
  entries: Layer2sArchivedEntry[]
}

export function Layer2sArchivedTableSection(props: Props) {
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
          <Layer2sArchivedTable entries={entries} />
        </TableSortingProvider>
      </PrimaryCard>
    </>
  )
}
