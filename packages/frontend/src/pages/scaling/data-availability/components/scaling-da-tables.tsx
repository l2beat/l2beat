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
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { compareStageAndTvs } from '~/server/features/scaling/utils/compare-stage-and-tvs'
import { getRecategorisedEntries } from '../../utils/get-recategorised-entries'
import { ScalingDaTable } from './table/scaling-da-table'

type Props = TabbedScalingEntries<ScalingDaEntry>

export function ScalingDaTables(props: Props) {
  const filterEntries = useFilterEntries()
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const entries = checked
    ? getRecategorisedEntries(filteredEntries, compareStageAndTvs)
    : filteredEntries

  const projectToBeMigratedToOthers = useMemo(
    () =>
      checked
        ? []
        : [...props.rollups, ...props.validiumsAndOptimiums, ...props.others]
            .filter((project) => project.statuses?.countdowns?.otherMigration)
            .map((project) => ({
              slug: project.slug,
              name: project.name,
              icon: project.icon,
            })),
    [checked, props.others, props.rollups, props.validiumsAndOptimiums],
  )

  const initialSort = {
    id: '#',
    desc: false,
  }
  return (
    <>
      <TableFilters
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
        ]}
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
          <DirectoryTabsTrigger value="others">
            Others <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
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
      </DirectoryTabs>
    </>
  )
}
