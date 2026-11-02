import { CountBadge } from '~/components/badge/CountBadge'
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
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { DisplayControls } from '~/components/table/display/DisplayControls'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { L2SummaryEntry } from '~/server/features/layer2s/summary/getL2SummaryEntries'
import { useTRPC } from '~/trpc/React'
import type { L2Tab, LazyTabbedL2Entries } from '../../utils/lazyL2Tabs'
import {
  useLazyL2TabEntries,
  useLazyL2TabFilters,
} from '../../utils/useLazyL2Tabs'
import { L2SummaryOthersTable } from './table/L2SummaryOthersTable'
import { L2SummaryRollupsTable } from './table/L2SummaryRollupsTable'
import type { L2SummaryTableProps } from './table/L2SummaryTableProps'
import { L2SummaryValidiumsAndOptimiumsTable } from './table/L2SummaryValidiumsAndOptimiumsTable'

type Props = LazyTabbedL2Entries<L2SummaryEntry>
export function L2SummaryTables(props: Props) {
  const { display, setDisplay } = useTvsDisplayControlsContext()
  const { allFilterables, counts } = useLazyL2TabFilters(props)

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 max-md:mt-4 max-md:px-4">
        <TableFilters entries={allFilterables} />
        <DisplayControls display={display} setDisplay={setDisplay} />
      </div>
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{counts.rollups.count}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums
            <CountBadge>{counts.validiumsAndOptimiums.count}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others
            <CountBadge>{counts.others.count}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <L2SummaryTab
              lazy={props}
              tab="rollups"
              rowCount={counts.rollups.rowCount}
              Table={L2SummaryRollupsTable}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <L2SummaryTab
              lazy={props}
              tab="validiumsAndOptimiums"
              rowCount={counts.validiumsAndOptimiums.rowCount}
              Table={L2SummaryValidiumsAndOptimiumsTable}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <OthersInfo />
            <L2SummaryTab
              lazy={props}
              tab="others"
              rowCount={counts.others.rowCount}
              Table={L2SummaryOthersTable}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}

function L2SummaryTab({
  lazy,
  tab,
  rowCount,
  Table,
}: {
  lazy: Props
  tab: L2Tab
  /** Rows the filtered entries render, known before they load. */
  rowCount: number
  Table: (props: L2SummaryTableProps) => React.ReactNode
}) {
  const trpc = useTRPC()
  const filterEntries = useFilterEntries()
  const { entries, isLoading } = useLazyL2TabEntries(
    lazy,
    tab,
    trpc.layer2s.summaryTabEntries.queryOptions({ tab }),
  )

  return (
    <Table
      entries={entries.filter(filterEntries)}
      // No row passes the filters, so the loaded tab would be the empty state anyway.
      isLoading={isLoading && rowCount > 0}
      skeletonCount={rowCount}
    />
  )
}
