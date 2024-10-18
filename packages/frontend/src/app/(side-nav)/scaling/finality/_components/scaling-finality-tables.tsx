'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { type groupByMainCategories } from '~/utils/group-by-main-categories'
import { BaseScalingFilters } from '../../_components/base-scaling-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFinalityTable } from './table/scaling-finality-table'

type Props =
  | {
      type?: never
      entries: ScalingFinalityEntry[]
    }
  | {
      type: 'recategorised'
      entries: ReturnType<typeof groupByMainCategories<ScalingFinalityEntry>>
    }

export function ScalingFinalityTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
    }
    return (
      <>
        <BaseScalingFilters
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
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingFinalityTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }
  const filteredEntries = props.entries.filter(includeFilters)
  return (
    <MainPageCard className="space-y-3 md:space-y-6">
      <BaseScalingFilters items={filteredEntries} />
      <ScalingFinalityTable entries={filteredEntries} />
    </MainPageCard>
  )
}
