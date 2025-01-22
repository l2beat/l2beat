'use client'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { OtherMigrationTabNotice } from '~/components/countdowns/other-migration/other-migration-tab-notice'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { type ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingDaTable } from './table/scaling-da-table'

type Props = TabbedScalingEntries<ScalingDaEntry>

export function ScalingDaTables(props: Props) {
  const includeFilters = useScalingFilter()
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }

  const entries = checked
    ? getRecategorisedEntries(
        filteredEntries,
        (a, b) => a.tvlOrder - b.tvlOrder,
      )
    : filteredEntries

  const projectToBeMigratedToOthers = useMemo(
    () =>
      checked
        ? []
        : [
            ...entries.rollups,
            ...entries.validiumsAndOptimiums,
            ...entries.others,
          ]
            .filter((project) => project.statuses?.countdowns?.otherMigration)
            .map((project) => ({
              slug: project.slug,
              name: project.name,
            })),
    [checked, entries.others, entries.rollups, entries.validiumsAndOptimiums],
  )

  const initialSort = {
    id: '#',
    desc: false,
  }
  return (
    <>
      <ScalingFilters
        items={[
          ...entries.rollups,
          ...entries.validiumsAndOptimiums,
          ...entries.others,
        ]}
        className="max-md:mt-4"
        showDALayerFilter
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          {entries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{entries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingDaTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingDaTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {entries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <OthersInfo />
              <ScalingDaTable entries={entries.others} />
              <OtherMigrationTabNotice
                projectsToBeMigrated={projectToBeMigratedToOthers}
                className="mt-2"
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
