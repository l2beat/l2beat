import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { EcosystemProjectsTable } from './EcosystemProjectsTable'

interface Props {
  ecosystem: EcosystemEntry
}

export function EcosystemProjectPageTables({ ecosystem }: Props) {
  const filterEntries = useFilterEntries()

  const entries = ecosystem.liveProjects.filter(filterEntries)

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <TableFilters entries={ecosystem.liveProjects} className="max-md:mt-4" />
      <PrimaryCard className="max-md:-mx-4 mt-4 max-md:rounded-none">
        <TableSortingProvider initialSort={initialSort}>
          <EcosystemProjectsTable
            entries={entries}
            ecosystemId={ecosystem.id}
          />
        </TableSortingProvider>
      </PrimaryCard>
    </>
  )
}
