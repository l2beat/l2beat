'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { type CategorisedScalingEntries } from '~/utils/group-by-main-categories'
import { ScalingActivityFilters } from '../../_components/scaling-activity-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingActivityTable } from './table/scaling-activity-table'

type Props = CategorisedScalingEntries<ScalingActivityEntry>

export function ScalingActivityTables({
  rollups,
  validiumsAndOptimiums,
  others,
}: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: rollups.filter(includeFilters),
    validiumsAndOptimiums: validiumsAndOptimiums.filter(includeFilters),
    others: others?.filter(includeFilters) ?? [],
  }

  const initialSort = {
    id: 'data_pastDayCount',
    desc: true,
  }

  return (
    <>
      <ScalingActivityFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
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
          {filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <ScalingActivityTable
              entries={filteredEntries.rollups}
              rollups
              customSortedRowModel={getStageSortedRowModel()}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingActivityTable
              entries={filteredEntries.validiumsAndOptimiums}
              customSortedRowModel={getStageSortedRowModel()}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <ScalingActivityTable
                entries={filteredEntries.others}
                customSortedRowModel={getStageSortedRowModel()}
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
