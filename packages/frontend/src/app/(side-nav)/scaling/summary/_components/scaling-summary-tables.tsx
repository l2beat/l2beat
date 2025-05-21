'use client'
import { useMemo } from 'react'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { OtherMigrationTabNotice } from '~/components/countdowns/other-migration/other-migration-tab-notice'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { featureFlags } from '~/consts/feature-flags'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { compareStageAndTvs } from '~/server/features/scaling/utils/compare-stage-and-tvs'
import { ExcludeAssociatedTokensCheckbox } from '../../_components/exclude-associated-tokens-checkbox'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingSummaryOthersTable } from './table/scaling-summary-others-table'
import { ScalingSummaryRollupsTable } from './table/scaling-summary-rollups-table'
import { ScalingSummaryValidiumsAndOptimiumsTable } from './table/scaling-summary-validiums-and-optimiums-table'
import { ScalingSummaryUnderReviewTable } from './table/scaling-summary-under-review-table'

type Props = TabbedScalingEntries<ScalingSummaryEntry>
export function ScalingSummaryTables(props: Props) {
  const filterEntries = useFilterEntries()
  const { checked } = useRecategorisationPreviewContext()
  const showRecategorised = checked || featureFlags.othersMigrated()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const recategorisedEntries = getRecategorisedEntries(
    filteredEntries,
    compareStageAndTvs,
  )

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
        : [
            ...entries.rollups,
            ...entries.validiumsAndOptimiums,
            ...entries.others,
          ]
            .filter((project) => project.statuses?.countdowns?.otherMigration)
            .map((project) => ({
              slug: project.slug,
              name: project.name,
              icon: project.icon,
            })),
    [checked, entries.others, entries.rollups, entries.validiumsAndOptimiums],
  )

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <div className="mr-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
        <TableFilters
          entries={[
            ...props.rollups,
            ...props.validiumsAndOptimiums,
            ...props.others,
          ].filter((e) => showRecategorised || e.statuses?.underReview !== 'config')}
        />
        <ExcludeAssociatedTokensCheckbox />
      </div>
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others
            <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
          {showRecategorised && (
            <DirectoryTabsTrigger value="underReview">
              Under review <CountBadge>{entries.underReview.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingSummaryRollupsTable entries={entries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingSummaryValidiumsAndOptimiumsTable
              entries={entries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <OthersInfo />
            <ScalingSummaryOthersTable entries={entries.others} />
            <OtherMigrationTabNotice
              projectsToBeMigrated={projectToBeMigratedToOthers}
              className="mt-2"
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showRecategorised && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="underReview">
              <ScalingSummaryUnderReviewTable entries={entries.underReview} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
