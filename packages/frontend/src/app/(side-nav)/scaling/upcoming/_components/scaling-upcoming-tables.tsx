'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { useRecategorisationPreviewContext } from '~/providers/recategorisation-preview-provider'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingUpcomingTable } from './table/scaling-upcoming-table'

export function ScalingUpcomingTables({
  entries,
}: { entries: TabbedScalingEntries<ScalingUpcomingEntry> }) {
  const includeFilters = useScalingFilter()
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: entries.rollups.filter(includeFilters),
    validiumsAndOptimiums: entries.validiumsAndOptimiums.filter(includeFilters),
    others: entries.others.filter(includeFilters),
  }

  const recategorisedEntries = checked
    ? getRecategorisedEntries(
        filteredEntries,
        (a, b) => b.initialOrder - a.initialOrder,
      )
    : filteredEntries

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <ScalingUpcomingAndArchivedFilters
        items={[
          ...recategorisedEntries.rollups,
          ...recategorisedEntries.validiumsAndOptimiums,
          ...recategorisedEntries.others,
        ]}
        className="max-md:ml-4 max-md:mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups{' '}
            <CountBadge>{recategorisedEntries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>
              {recategorisedEntries.validiumsAndOptimiums.length}
            </CountBadge>
          </DirectoryTabsTrigger>
          {recategorisedEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others{' '}
              <CountBadge>{recategorisedEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingUpcomingTable entries={recategorisedEntries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingUpcomingTable
              entries={recategorisedEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {recategorisedEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <OthersInfo />
              <ScalingUpcomingTable entries={recategorisedEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
