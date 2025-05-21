'use client'
import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
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
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { UopsExplorerLink } from '../../_components/uops-explorer-link'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingActivityTable } from './table/scaling-activity-table'
import { featureFlags } from '~/consts/feature-flags'

type Props = TabbedScalingEntries<ScalingActivityEntry> & {
  milestones: Milestone[]
}

export function ScalingActivityTabs(props: Props) {
  const filterEntries = useFilterEntries()
  const { checked } = useRecategorisationPreviewContext()
  const showRecategorised = checked || featureFlags.othersMigrated()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const recategorisedEntries = getRecategorisedEntries(filteredEntries, undefined)

  const baseEntries = {
    rollups: filteredEntries.rollups.filter(
      (e) => e.statuses?.underReview !== 'config',
    ),
    validiumsAndOptimiums: filteredEntries.validiumsAndOptimiums.filter(
      (e) => e.statuses?.underReview !== 'config',
    ),
    others: filteredEntries.others.filter(
      (e) => e.statuses?.underReview !== 'config',
    ),
    underReview: [],
  }

  const entries = showRecategorised
    ? recategorisedEntries
    : baseEntries

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
    id: 'data_pastDayCount',
    desc: true,
  }

  return (
    <>
      <div className="mr-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
        <TableFilters
          entries={[
            ...props.rollups,
            ...props.validiumsAndOptimiums,
            ...props.others,
          ].filter((e) => showRecategorised || e.statuses?.underReview !== 'config')}
        />
        <UopsExplorerLink />
      </div>
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
          {showRecategorised && (
            <DirectoryTabsTrigger value="underReview">
              Under review <CountBadge>{entries.underReview.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-4 sm:pt-3">
            <RollupsInfo />
            <ScalingActivityChart
              entries={entries.rollups}
              milestones={props.milestones}
              type="Rollups"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <ScalingActivityTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent
            value="validiumsAndOptimiums"
            className="pt-4 sm:pt-3"
          >
            <ValidiumsAndOptimiumsInfo />
            <ScalingActivityChart
              entries={entries.validiumsAndOptimiums}
              milestones={props.milestones}
              hideScalingFactor
              type="ValidiumsAndOptimiums"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <ScalingActivityTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="pt-4 sm:pt-3">
            <OthersInfo />
            <ScalingActivityChart
              entries={entries.others}
              milestones={props.milestones}
              hideScalingFactor
              type="Others"
            />
            <HorizontalSeparator className="mb-3 mt-5" />
            <ScalingActivityTable entries={entries.others} />
            <OtherMigrationTabNotice
              projectsToBeMigrated={projectToBeMigratedToOthers}
              className="mt-2"
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showRecategorised && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="underReview" className="pt-4 sm:pt-3">
              <ScalingActivityTable entries={entries.underReview} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
