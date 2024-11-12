'use client'

import { Suspense } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { env } from '~/env'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { useScalingUpcomingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { ScalingUpcomingTable } from './table/scaling-upcoming-table'

export function ScalingUpcomingTables({
  entries,
}: { entries: ScalingUpcomingEntry[] }) {
  const includeFilters = useScalingUpcomingFilter()

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    const { rollups, validiumsAndOptimiums } = groupByMainCategories(entries)
    const filteredRollups = rollups.filter(includeFilters)
    const filteredValidiumsAndOptimiums =
      validiumsAndOptimiums.filter(includeFilters)
    return (
      <>
        <ScalingUpcomingAndArchivedFilters
          items={[...filteredRollups, ...filteredValidiumsAndOptimiums]}
          className="max-md:ml-4 max-md:mt-4"
        />
        <Suspense>
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
              <ScalingUpcomingTable entries={filteredRollups} />
            </DirectoryTabsContent>
            <DirectoryTabsContent value="validiums-and-optimiums">
              <ScalingUpcomingTable entries={filteredValidiumsAndOptimiums} />
            </DirectoryTabsContent>
          </DirectoryTabs>
        </Suspense>
      </>
    )
  }

  const filteredEntries = entries.filter(includeFilters)

  return (
    <MainPageCard className="space-y-3 md:space-y-6">
      <ScalingUpcomingAndArchivedFilters items={filteredEntries} />
      <ScalingUpcomingTable entries={filteredEntries} />
    </MainPageCard>
  )
}
