import type { ProjectId } from '@l2beat/shared-pure'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { EcosystemProjectsTable } from './EcosystemProjectsTable'

interface Props {
  entries: EcosystemProjectEntry[]
  ecosystemId: ProjectId
}

export function EcosystemProjectsTableWithFilters({
  ecosystemId,
  entries,
}: Props) {
  const filterEntries = useFilterEntries()
  const filteredEntries = entries.filter(filterEntries)

  return (
    <>
      <div className="mr-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
        <TableFilters entries={entries} />
      </div>
      <EcosystemProjectsTable
        entries={filteredEntries}
        ecosystemId={ecosystemId}
      />
    </>
  )
}
