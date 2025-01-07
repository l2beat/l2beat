'use client'
import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/count-badge'
import { ScalingStackedTvlChart } from '~/components/chart/tvl/stacked/scaling-stacked-tvl-chart'
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
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { ScalingTvlTable } from './table/scaling-tvl-table'

type Props = TabbedScalingEntries<ScalingTvlEntry> & {
  milestones: Milestone[]
}

export function ScalingTvlTabs(props: Props) {
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
    id: 'total',
    desc: true,
  }

  return (
    <>
      <ScalingFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        showHostChainFilter
        className="max-md:mt-4"
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
          <DirectoryTabsContent value="rollups" className="main-page-card pt-5">
            <ScalingStackedTvlChart
              milestones={props.milestones}
              entries={props.rollups}
            />
            <HorizontalSeparator className="my-5" />
            <RollupsInfo />
            <ScalingTvlTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent
            value="validiums-and-optimiums"
            className="main-page-card pt-5"
          >
            <ScalingStackedTvlChart
              milestones={props.milestones}
              entries={props.validiumsAndOptimiums}
            />
            <HorizontalSeparator className="my-5" />
            <ValidiumsAndOptimiumsInfo />
            <ScalingTvlTable entries={filteredEntries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="main-page-card pt-5">
            <ScalingStackedTvlChart
              milestones={props.milestones}
              entries={props.others ?? []}
            />
            <HorizontalSeparator className="my-5" />
            <OthersInfo />
            <ScalingTvlTable entries={filteredEntries.others} />
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
