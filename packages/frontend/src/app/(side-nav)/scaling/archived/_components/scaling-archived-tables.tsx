'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { env } from '~/env'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { ScalingArchivedTable } from './table/scaling-archived-table'

export function ScalingArchivedTables({
  entries,
}: { entries: ScalingArchivedEntry[] }) {
  const includeFilters = useScalingFilter()

  if (env.FEATURE_FLAG_RECATEGORISATION) {
    const { rollups, validiumsAndOptimiums } = groupByMainCategories(entries)
    const filteredRollups = rollups.filter(includeFilters)
    const filteredValidiumsAndOptimiums =
      validiumsAndOptimiums.filter(includeFilters)
    return (
      <>
        <ScalingUpcomingAndArchivedFilters
          items={[...filteredRollups, ...filteredValidiumsAndOptimiums]}
        />
        <DirectoryTabs defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">
              Rollups <CountBadge>{filteredRollups.length}</CountBadge>
            </DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="validiums-and-optimiums">
              Validiums & Optimiums{' '}
              <CountBadge>{filteredValidiumsAndOptimiums.length}</CountBadge>
            </DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingArchivedTable entries={filteredRollups} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingArchivedTable entries={filteredValidiumsAndOptimiums} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }

  const filteredEntries = entries.filter(includeFilters)

  return (
    <MainPageCard className="space-y-3 md:space-y-6">
      <ScalingUpcomingAndArchivedFilters items={filteredEntries} />
      <ScalingArchivedTable entries={filteredEntries} />
    </MainPageCard>
  )
}
