'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { type CategorisedScalingEntries } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { ScalingArchivedTable } from './table/scaling-archived-table'

export function ScalingArchivedTables({
  entries,
}: { entries: CategorisedScalingEntries<ScalingArchivedEntry> }) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: entries.rollups.filter(includeFilters),
    validiumsAndOptimiums: entries.validiumsAndOptimiums.filter(includeFilters),
    others: entries.others?.filter(includeFilters) ?? [],
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <ScalingUpcomingAndArchivedFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        className="max-md:ml-4 max-md:mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums-and-optimiums">
            Validiums & Optimiums{' '}
            <CountBadge>
              {filteredEntries.validiumsAndOptimiums.length}
            </CountBadge>
          </DirectoryTabsTrigger>
          {filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <ScalingArchivedTable entries={filteredEntries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingArchivedTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <ScalingArchivedTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
