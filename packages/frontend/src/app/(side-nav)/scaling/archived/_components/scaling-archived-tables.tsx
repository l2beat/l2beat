'use client'

import { useEffect, useState } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { compareStageAndTvs } from '~/server/features/scaling/utils/compare-stage-and-tvs'
import type { TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingUpcomingAndArchivedFilters } from '../../_components/scaling-upcoming-and-archived-filters'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingArchivedTable } from './table/scaling-archived-table'

export function ScalingArchivedTables(
  props: TabbedScalingEntries<ScalingArchivedEntry>,
) {
  const includeFilters = useScalingFilter()
  const [tab, setTab] = useState('rollups')
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }

  const entries = checked
    ? getRecategorisedEntries(filteredEntries, compareStageAndTvs)
    : filteredEntries

  const initialSort = {
    id: 'total',
    desc: true,
  }

  useEffect(() => {
    if (!checked && tab === 'others' && entries.others.length === 0) {
      setTab('rollups')
    }
  }, [checked, entries.others, tab])

  const showOthers = checked || entries.others.length > 0
  return (
    <>
      <ScalingUpcomingAndArchivedFilters
        items={[
          ...entries.rollups,
          ...entries.validiumsAndOptimiums,
          ...entries.others,
        ]}
        className="max-md:ml-4 max-md:mt-4"
      />
      <DirectoryTabs value={tab} onValueChange={setTab}>
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          {showOthers && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{entries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingArchivedTable entries={entries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingArchivedTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showOthers && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <OthersInfo />
              <ScalingArchivedTable entries={entries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
