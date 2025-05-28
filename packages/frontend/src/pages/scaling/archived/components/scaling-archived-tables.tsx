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
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { compareStageAndTvs } from '~/server/features/scaling/utils/compare-stage-and-tvs'
import { getRecategorisedEntries } from '../../utils/get-recategorised-entries'
import { ScalingArchivedTable } from './table/scaling-archived-table'

export function ScalingArchivedTables(
  props: TabbedScalingEntries<ScalingArchivedEntry>,
) {
  const filterEntries = useFilterEntries()
  const [tab, setTab] = useState('rollups')
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
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
      <TableFilters
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
        ]}
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
