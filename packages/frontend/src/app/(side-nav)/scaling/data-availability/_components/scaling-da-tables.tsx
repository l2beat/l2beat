'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { type groupByMainCategories } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingDaFilters } from './scaling-da-filters'
import { ScalingDataAvailabilityTable } from './table/scaling-da-table'

type Props =
  | {
      type?: never
      entries: ScalingDataAvailabilityEntry[]
    }
  | {
      type: 'recategorised'
      entries: ReturnType<
        typeof groupByMainCategories<ScalingDataAvailabilityEntry>
      >
    }

export function ScalingDaTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
    }
    return (
      <>
        <ScalingDaFilters
          items={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
        />
        <DirectoryTabs className="mt-6" defaultValue="rollups">
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
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingDataAvailabilityTable
              entries={filteredEntries.rollups}
              rollups
            />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingDataAvailabilityTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }
  const filteredEntries = props.entries.filter(includeFilters)
  return (
    <MainPageCard className="space-y-3 md:space-y-6">
      <ScalingDaFilters items={filteredEntries} />
      <ScalingDataAvailabilityTable entries={filteredEntries} />
    </MainPageCard>
  )
}
