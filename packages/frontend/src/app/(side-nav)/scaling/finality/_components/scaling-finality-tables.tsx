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
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { BaseScalingFilters } from '../../_components/base-scaling-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFinalityTable } from './table/scaling-finality-table'

type Props = RecategorisedScalingEntry<ScalingFinalityEntry>

export function ScalingFinalityTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
      others: props.entries.others?.filter(includeFilters),
    }
    return (
      <>
        <BaseScalingFilters
          items={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
        />
        <DirectoryTabs defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">
              Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
            </DirectoryTabsTrigger>
            {filteredEntries.others && filteredEntries.others.length > 0 && (
              <DirectoryTabsTrigger value="others">
                Others <CountBadge>{filteredEntries.others.length}</CountBadge>
              </DirectoryTabsTrigger>
            )}
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingFinalityTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
          {filteredEntries.others && filteredEntries.others.length > 0 && (
            <DirectoryTabsContent value="others">
              <ScalingFinalityTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          )}
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
