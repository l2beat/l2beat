'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { featureFlags } from '~/consts/feature-flags'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { ScalingUpcomingTable } from './table/scaling-upcoming-table'

export function ScalingUpcomingTables({
  entries,
}: { entries: TabbedScalingEntries<ScalingUpcomingEntry> }) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: entries.rollups.filter(includeFilters),
    validiumsAndOptimiums: entries.validiumsAndOptimiums.filter(includeFilters),
    others: entries.others.filter(includeFilters),
  }

  const initialSort = {
    id: '#',
    desc: false,
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
          {featureFlags.showOthers && filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingUpcomingTable entries={filteredEntries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingUpcomingTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {featureFlags.showOthers && filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <OthersInfo />
              <ScalingUpcomingTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
