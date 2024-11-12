'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { ScalingArchivedTable } from './table/scaling-archived-table'

export function ScalingArchivedTables({
  entries,
}: { entries: RecategorisedScalingEntry<ScalingArchivedEntry> }) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: entries.rollups.filter(includeFilters),
    validiumsAndOptimiums: entries.validiumsAndOptimiums.filter(includeFilters),
    others: entries.others?.filter(includeFilters) ?? [],
  }
  return (
    <>
      <ScalingUpcomingAndArchivedFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
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
        <DirectoryTabsContent value="rollups">
          <ScalingArchivedTable entries={filteredEntries.rollups} />
        </DirectoryTabsContent>
        <DirectoryTabsContent value="validiums-and-optimiums">
          <ScalingArchivedTable
            entries={filteredEntries.validiumsAndOptimiums}
          />
        </DirectoryTabsContent>
        {filteredEntries.others.length > 0 && (
          <DirectoryTabsContent value="others">
            <ScalingArchivedTable entries={filteredEntries.others} />
          </DirectoryTabsContent>
        )}
      </DirectoryTabs>
    </>
  )
}
