'use client'
import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import { ScalingStackedTvsChart } from '~/components/chart/tvs/stacked/scaling-stacked-tvs-chart'
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
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import type { TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingTvsTable } from './table/scaling-tvs-table'

type Props = TabbedScalingEntries<ScalingTvsEntry> & {
  milestones: Milestone[]
}

export function ScalingTvsTabs(props: Props) {
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
        (a, b) => b.tvsOrder - a.tvsOrder,
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
    id: 'total',
    desc: true,
  }

  return (
    <>
      <ScalingFilters
        items={[
          ...entries.rollups,
          ...entries.validiumsAndOptimiums,
          ...entries.others,
        ]}
        showHostChainFilter
        className="max-md:mt-4"
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
          <DirectoryTabsContent value="rollups" className="pt-5">
            <ScalingStackedTvsChart
              tab="rollups"
              milestones={props.milestones}
              entries={props.rollups}
            />
            <HorizontalSeparator className="my-5" />
            <RollupsInfo />
            <ScalingTvsTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums" className="pt-5">
            <ScalingStackedTvsChart
              tab="validiumsAndOptimiums"
              milestones={props.milestones}
              entries={props.validiumsAndOptimiums}
            />
            <HorizontalSeparator className="my-5" />
            <ValidiumsAndOptimiumsInfo />
            <ScalingTvsTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="pt-5">
            <ScalingStackedTvsChart
              tab="others"
              milestones={props.milestones}
              entries={props.others ?? []}
            />
            <HorizontalSeparator className="my-5" />
            <OthersInfo />
            <ScalingTvsTable entries={entries.others} />
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
