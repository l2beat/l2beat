import type { Milestone } from '@l2beat/config'
import { CountBadge } from '~/components/badge/CountBadge'
import { L2CostsChart } from '~/components/chart/costs/L2CostsChart'
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
} from '~/components/L2TabsInfo'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2CostsEntry } from '~/server/features/layer2s/costs/getL2CostsEntries'
import { L2CostsTable } from './table/L2CostsTable'

type Props = TabbedL2Entries<L2CostsEntry> & {
  milestones: Milestone[]
}

export function L2CostsTabs(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const initialSort = {
    id: 'total-cost',
    desc: false,
  }

  return (
    <>
      <TableFilters
        className="max-md:mt-4 max-md:px-4"
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
            <L2CostsChart
              tab="rollups"
              entries={entries.rollups}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <L2CostsTable entries={entries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent
            value="validiumsAndOptimiums"
            className="pt-4 sm:pt-3"
          >
            <ValidiumsAndOptimiumsInfo />
            <L2CostsChart
              tab="validiumsAndOptimiums"
              entries={entries.validiumsAndOptimiums}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <L2CostsTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others" className="pt-4 sm:pt-3">
            <OthersInfo />
            <L2CostsChart
              tab="others"
              entries={entries.others}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <L2CostsTable entries={entries.others} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
