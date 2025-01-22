'use client'
import type { Milestone } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import { ActivityChart } from '~/components/chart/activity/activity-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { OtherMigrationTabNotice } from '~/components/countdowns/other-migration/other-migration-tab-notice'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { ScalingActivityFilters } from '../../_components/scaling-activity-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingActivityTable } from './table/scaling-activity-table'

type Props = TabbedScalingEntries<ScalingActivityEntry> & {
  milestones: Milestone[]
}

export function ScalingActivityTabs({
  rollups,
  validiumsAndOptimiums,
  others,
  milestones,
}: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: rollups.filter(includeFilters),
    validiumsAndOptimiums: validiumsAndOptimiums.filter(includeFilters),
    others: others.filter(includeFilters),
  }

  const projectToBeMigratedToOthers = useMemo(
    () =>
      [...rollups, ...validiumsAndOptimiums, ...others]
        .filter((project) => project.statuses?.countdowns?.otherMigration)
        .map((project) => ({
          slug: project.slug,
          name: project.name,
        })),
    [others, rollups, validiumsAndOptimiums],
  )

  const initialSort = {
    id: 'data_pastDayCount',
    desc: true,
  }

  const showOthers =
    filteredEntries.others.length > 0 &&
    !filteredEntries.others.every((e) => !e.data || e.id === ProjectId.ETHEREUM)

  return (
    <>
      <ScalingActivityFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        className="max-md:mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups{' '}
            <CountBadge>{filteredEntries.rollups.length - 1}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>
              {filteredEntries.validiumsAndOptimiums.length - 1}
            </CountBadge>
          </DirectoryTabsTrigger>
          {showOthers && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-5">
            <ActivityChart
              milestones={milestones}
              entries={rollups}
              type="Rollups"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <RollupsInfo />
            <ScalingActivityTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums" className="pt-5">
            <ActivityChart
              milestones={milestones}
              entries={validiumsAndOptimiums}
              hideScalingFactor
              type="ValidiumsAndOptimiums"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <ValidiumsAndOptimiumsInfo />
            <ScalingActivityTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showOthers && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others" className="pt-5">
              <ActivityChart
                milestones={milestones}
                entries={others ?? []}
                hideScalingFactor
                type="Others"
              />
              <HorizontalSeparator className="mb-3 mt-5" />
              <OthersInfo />
              <ScalingActivityTable entries={filteredEntries.others} />
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
