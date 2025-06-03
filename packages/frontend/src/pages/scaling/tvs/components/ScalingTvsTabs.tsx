import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import {
  OthersInfo,
  RollupsInfo,
  UnderReviewInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { CountBadge } from '~/components/badge/CountBadge'
import { ScalingStackedTvsChart } from '~/components/chart/tvs/stacked/ScalingStackedTvsChart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { OtherMigrationTabNotice } from '~/components/countdowns/other-migration/OtherMigrationTabNotice'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/RecategorisationPreviewProvider'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { compareStageAndTvs } from '~/server/features/scaling/utils/compareStageAndTvs'
import { getRecategorisedEntries } from '../../utils/GetRecategorisedEntries'
import { ScalingTvsTable } from './table/ScalingTvsTable'

type Props = TabbedScalingEntries<ScalingTvsEntry> & {
  milestones: Milestone[]
}

export function ScalingTvsTabs(props: Props) {
  const filterEntries = useFilterEntries()
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    underReview: props.underReview.filter(filterEntries),
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
    id: 'total',
    desc: true,
  }

  return (
    <>
      <TableFilters
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
          ...props.underReview,
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
          {entries.underReview.length > 0 && (
            <DirectoryTabsTrigger value="underReview">
              Under initial review
              <CountBadge>{entries.underReview.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-4 sm:pt-3">
            <RollupsInfo />
            <ScalingStackedTvsChart
              tab="rollups"
              entries={entries.rollups}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingTvsTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums" className="pt-5">
            <ValidiumsAndOptimiumsInfo />
            <ScalingStackedTvsChart
              tab="validiumsAndOptimiums"
              entries={entries.validiumsAndOptimiums}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingTvsTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="pt-5">
            <OthersInfo />
            <ScalingStackedTvsChart
              tab="others"
              entries={entries.others}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingTvsTable entries={entries.others} />
            <OtherMigrationTabNotice
              projectsToBeMigrated={projectToBeMigratedToOthers}
              className="mt-2"
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="underReview" className="pt-5">
            <UnderReviewInfo />
            <ScalingTvsTable entries={entries.underReview} underReview />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
