import type { Milestone } from '@l2beat/config'
import {
  OthersInfo,
  RollupsInfo,
  UnderReviewInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { CountBadge } from '~/components/badge/CountBadge'
import { ScalingActivityChart } from '~/components/chart/activity/ScalingActivityChart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { UopsExplorerLink } from '../../components/UopsExplorerLink'
import { ScalingActivityTable } from './table/ScalingActivityTable'

type Props = TabbedScalingEntries<ScalingActivityEntry> & {
  milestones: Milestone[]
}

export function ScalingActivityTabs(props: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    underReview: props.underReview.filter(filterEntries),
  }

  const entries = filteredEntries

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
            ...props.underReview,
          ]}
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
            Others <CountBadge>{entries.others.length - 1}</CountBadge>
          </DirectoryTabsTrigger>
          {entries.underReview.length > 0 && (
            <DirectoryTabsTrigger value="underReview">
              Under initial review
              <CountBadge>{entries.underReview.length - 1}</CountBadge>
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
            <HorizontalSeparator className="mt-5 mb-3" />
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
            <HorizontalSeparator className="mt-5 mb-3" />
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
            <HorizontalSeparator className="mt-5 mb-3" />
            <ScalingActivityTable entries={entries.others} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="underReview" className="pt-4 sm:pt-3">
            <UnderReviewInfo />
            <ScalingActivityTable entries={entries.underReview} underReview />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
