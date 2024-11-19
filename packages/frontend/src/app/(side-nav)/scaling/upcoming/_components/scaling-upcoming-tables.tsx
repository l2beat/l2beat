'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { type CategorisedScalingEntries } from '~/utils/group-by-main-categories'
import { useScalingUpcomingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { ScalingUpcomingTable } from './table/scaling-upcoming-table'

export function ScalingUpcomingTables({
  entries,
}: { entries: CategorisedScalingEntries<ScalingUpcomingEntry> }) {
  const includeFilters = useScalingUpcomingFilter()

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
        <DirectoryTabsContent value="rollups">
          <ScalingUpcomingTable entries={filteredEntries.rollups} />
        </DirectoryTabsContent>
        <DirectoryTabsContent value="validiums-and-optimiums">
          <ScalingUpcomingTable
            entries={filteredEntries.validiumsAndOptimiums}
          />
        </DirectoryTabsContent>
        {filteredEntries.others.length > 0 && (
          <DirectoryTabsContent value="others">
            <ScalingUpcomingTable entries={filteredEntries.others} />
          </DirectoryTabsContent>
        )}
      </DirectoryTabs>
    </>
  )
}
