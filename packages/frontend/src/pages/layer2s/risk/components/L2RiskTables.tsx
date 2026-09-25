import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/L2TabsInfo'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import { getL2TabTableCaption } from '~/pages/layer2s/utils/getL2TabTableCaption'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2RiskEntry } from '~/server/features/layer2s/risks/getL2RiskEntries'
import { L2RiskTable } from './table/L2RiskTable'

type Props = TabbedL2Entries<L2RiskEntry>

export function L2RiskTables(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const initialSort = {
    id: '#',
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
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <L2RiskTable
              entries={entries.rollups}
              caption={getL2TabTableCaption(
                'Risk analysis of scaling projects',
                'rollups',
              )}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <L2RiskTable
              entries={entries.validiumsAndOptimiums}
              caption={getL2TabTableCaption(
                'Risk analysis of scaling projects',
                'validiumsAndOptimiums',
              )}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <OthersInfo />
            <L2RiskTable
              entries={entries.others}
              caption={getL2TabTableCaption(
                'Risk analysis of scaling projects',
                'others',
              )}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
