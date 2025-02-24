'use client'
import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import { ScalingActivityChart } from '~/components/chart/activity/scaling-activity-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { OtherMigrationTabNotice } from '~/components/countdowns/other-migration/other-migration-tab-notice'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import type { TabbedScalingEntries } from '~/utils/group-by-tabs'
import { ScalingActivityFilters } from '../../_components/scaling-activity-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingActivityTable } from './table/scaling-activity-table'

type Props = TabbedScalingEntries<ScalingActivityEntry> & {
  milestones: Milestone[]
}

export function ScalingActivityTabs(props: Props) {
  const includeFilters = useScalingFilter()
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }

  const entries = checked
    ? // No need to sort because it is done later by TPS/UOPS switch
      getRecategorisedEntries(filteredEntries, undefined)
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
            })),
    [checked, props.others, props.rollups, props.validiumsAndOptimiums],
  )

  const initialSort = {
    id: 'data_pastDayCount',
    desc: true,
  }

  return (
    <>
      <ScalingActivityFilters
        items={[
          ...entries.rollups,
          ...entries.validiumsAndOptimiums,
          ...entries.others,
        ]}
        className="max-md:mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length - 1}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>{entries.validiumsAndOptimiums.length - 1}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-5">
            <ScalingActivityChart
              entries={entries.rollups}
              milestones={props.milestones}
              type="Rollups"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <RollupsInfo />
            <ScalingActivityTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums" className="pt-5">
            <ScalingActivityChart
              entries={entries.validiumsAndOptimiums}
              milestones={props.milestones}
              hideScalingFactor
              type="ValidiumsAndOptimiums"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <ValidiumsAndOptimiumsInfo />
            <ScalingActivityTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="pt-5">
            <ScalingActivityChart
              entries={entries.others}
              milestones={props.milestones}
              hideScalingFactor
              type="Others"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <OthersInfo />
            <ScalingActivityTable entries={entries.others} />
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
