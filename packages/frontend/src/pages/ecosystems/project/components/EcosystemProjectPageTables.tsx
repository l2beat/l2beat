import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import { ScalingUpcomingTable } from '~/pages/scaling/upcoming/components/table/ScalingUpcomingTable'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { EcosystemProjectsTable } from './EcosystemProjectsTable'

interface Props {
  ecosystem: EcosystemEntry
}

export function EcosystemProjectPageTables({ ecosystem }: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    liveProjects: ecosystem.liveProjects.filter(filterEntries),
    upcomingProjects: ecosystem.upcomingProjects.filter(filterEntries),
  }

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <TableFilters
        entries={[...ecosystem.liveProjects, ...ecosystem.upcomingProjects]}
        className="max-md:px-0"
      />
      <DirectoryTabs
        defaultValue="live"
        className="max-md:-mx-4 rounded-b-none p-0!"
      >
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="live">
            Live <CountBadge>{entries.liveProjects.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="upcoming">
            Upcoming
            <CountBadge>{entries.upcomingProjects.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="live">
            <EcosystemProjectsTable
              entries={entries.liveProjects}
              ecosystemId={ecosystem.id}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="upcoming">
            <ScalingUpcomingTable entries={entries.upcomingProjects} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
