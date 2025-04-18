'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'
import type { TabbedBridgeEntries } from '../../_utils/group-by-bridge-tabs'
import { BridgesSummaryOthersTable } from './table/bridges-summary-others-table'
import { BridgesSummarySingleChainTable } from './table/bridges-summary-singlechain-table'

type Props = TabbedBridgeEntries<BridgesSummaryEntry>
export function BridgesSummaryTables(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    singleChain: props.singleChain.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <TableFilters entries={[...props.singleChain, ...props.others]} />
      <DirectoryTabs defaultValue="singleChain">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="singleChain">
            Single-chain <CountBadge>{entries.singleChain.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others
            <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="singleChain">
            <BridgesSummarySingleChainTable entries={entries.singleChain} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <BridgesSummaryOthersTable entries={entries.others} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
