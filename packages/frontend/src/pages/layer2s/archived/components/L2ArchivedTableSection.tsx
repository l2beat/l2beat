import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import { TableEmptyState } from '~/components/table/TableEmptyState'
import { getWalkAwayVerdict } from '~/consts/walkAwayProjects'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { L2ArchivedTable } from './table/L2ArchivedTable'

interface Props {
  entries: L2ArchivedEntry[]
}

export function L2ArchivedTableSection(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = props.entries.filter(filterEntries)
  const passedEntries = entries.filter(
    (entry) => getWalkAwayVerdict(entry.id, true) === 'passed',
  )
  const notPassedEntries = entries.filter(
    (entry) => getWalkAwayVerdict(entry.id, true) === 'not-passed',
  )

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
      {entries.length === 0 && (
        <PrimaryCard className="mt-4">
          <TableEmptyState />
        </PrimaryCard>
      )}
      <TableSortingProvider initialSort={initialSort}>
        {passedEntries.length > 0 && (
          <PrimaryCard className="mt-4">
            <L2ArchivedTable entries={passedEntries} walkAway="passed" />
          </PrimaryCard>
        )}
      </TableSortingProvider>
      <TableSortingProvider initialSort={initialSort}>
        {notPassedEntries.length > 0 && (
          <PrimaryCard className="mt-6">
            <L2ArchivedTable entries={notPassedEntries} walkAway="not-passed" />
          </PrimaryCard>
        )}
      </TableSortingProvider>
    </>
  )
}
