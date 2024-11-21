'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { type ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { type CategorisedScalingEntries } from '~/utils/group-by-main-categories'
import { BaseScalingFilters } from '../../_components/base-scaling-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFinalityTable } from './table/scaling-finality-table'

type Props = CategorisedScalingEntries<ScalingFinalityEntry>

export function ScalingFinalityTables(props: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others?.filter(includeFilters) ?? [],
  }

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <BaseScalingFilters
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
          {filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <ScalingFinalityTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <ScalingFinalityTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
