import type { Milestone } from '@l2beat/config'
import { CountBadge } from '~/components/badge/CountBadge'
import { ScalingCostsChart } from '~/components/chart/costs/ScalingCostsChart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/getScalingCostsEntries'
import { ScalingCostsTable } from './table/ScalingCostsTable'

type Props = TabbedScalingEntries<ScalingCostsEntry> & {
  milestones: Milestone[]
}

export function ScalingCostsTabs(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    notReviewed: props.notReviewed.filter(filterEntries),
  }

  const initialSort = {
    id: 'total-cost',
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
            Validiums & Optimiums
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-4 sm:pt-3">
            <RollupsInfo />
            <ScalingCostsChart
              tab="rollups"
              entries={entries.rollups}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingCostsTable entries={entries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent
            value="validiumsAndOptimiums"
            className="pt-4 sm:pt-3"
          >
            <ValidiumsAndOptimiumsInfo />
            <ScalingCostsChart
              tab="validiumsAndOptimiums"
              entries={entries.validiumsAndOptimiums}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingCostsTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="pt-4 sm:pt-3">
            <OthersInfo />
            <ScalingCostsChart
              tab="others"
              entries={entries.others}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingCostsTable entries={entries.others} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
