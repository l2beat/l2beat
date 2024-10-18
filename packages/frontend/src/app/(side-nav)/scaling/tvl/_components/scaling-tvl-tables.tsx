'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type groupByMainCategories } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../_components/scaling-tvl-filters'
import { ScalingTvlTable } from './table/scaling-tvl-table'

type Props =
  | {
    type?: never
    entries: ScalingTvlEntry[]
  }
  | {
    type: 'recategorised'
    entries: ReturnType<typeof groupByMainCategories<ScalingTvlEntry>>
  }

export function ScalingTvlTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
    }
    return (
      <>
        <ScalingTvlFilters
          items={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
          className="mt-6"
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
            <ScalingTvlTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingTvlTable entries={filteredEntries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }

  return (
    <MainPageCard className="space-y-3 md:mt-6 md:space-y-6">
      <ScalingTvlFilters items={props.entries} />
      <ScalingTvlTable entries={props.entries} />
    </MainPageCard>
  )
}
