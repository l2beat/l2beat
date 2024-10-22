'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { ScalingActivityTable } from './table/scaling-activity-table'

type Props = RecategorisedScalingEntry<ScalingActivityEntry>

export function ScalingActivityTables(props: Props) {
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
        <ScalingFilters
          items={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
          className="mt-4"
        />
        <DirectoryTabs defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">
              Rollups{' '}
              <CountBadge>{filteredEntries.rollups.length - 1}</CountBadge>
            </DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="validiums-and-optimiums">
              Validiums & Optimiums{' '}
              <CountBadge>
                {filteredEntries.validiumsAndOptimiums.length - 1}
              </CountBadge>
            </DirectoryTabsTrigger>
            {filteredEntries.others && filteredEntries.others.length > 0 && (
              <DirectoryTabsTrigger value="others">
                Others <CountBadge>{filteredEntries.others.length}</CountBadge>
              </DirectoryTabsTrigger>
            )}
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingActivityTable
              entries={filteredEntries.rollups}
              rollups
              customSortedRowModel={getStageSortedRowModel()}
            />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingActivityTable
              entries={filteredEntries.validiumsAndOptimiums}
              customSortedRowModel={getStageSortedRowModel()}
            />
          </DirectoryTabsContent>
          {filteredEntries.others && filteredEntries.others.length > 0 && (
            <DirectoryTabsContent value="others">
              <ScalingActivityTable
                entries={filteredEntries.others}
                customSortedRowModel={getStageSortedRowModel()}
              />
            </DirectoryTabsContent>
          )}
        </DirectoryTabs>
      </>
    )
  }

  return (
    <MainPageCard className="space-y-3 md:mt-6 md:space-y-6">
      <ScalingFilters items={props.entries} />
      <ScalingActivityTable entries={props.entries} />
    </MainPageCard>
  )
}
