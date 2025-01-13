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
import { ScalingDaTable } from './table/scaling-da-table'

type Props = TabbedScalingEntries<ScalingDaEntry>

export function ScalingDaTables(props: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }

  const projectToBeMigratedToOthers = useMemo(
    () =>
      [...props.rollups, ...props.validiumsAndOptimiums, ...props.others]
        .filter((project) => project.statuses?.countdowns?.otherMigration)
        .map((project) => ({
          slug: project.slug,
          name: project.name,
        })),
    [props.others, props.rollups, props.validiumsAndOptimiums],
  )

  const initialSort = {
    id: '#',
    desc: false,
  }
  return (
    <>
      <ScalingFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        className="max-md:mt-4"
        showDALayerFilter
      />
      <DirectoryTabs defaultValue="rollups">
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
          {filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingDaTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingDaTable entries={filteredEntries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <OthersInfo />
              <ScalingDaTable entries={filteredEntries.others} />
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
