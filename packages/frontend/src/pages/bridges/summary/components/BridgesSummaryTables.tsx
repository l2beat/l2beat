import { CountBadge } from '~/components/badge/CountBadge'
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
import type { BridgesSummaryEntry } from '~/server/features/bridges/getBridgesSummaryEntries'
import type { TabbedBridgeEntries } from '../../utils/groupByBridgeTabs'
import { BridgesSummaryOthersTable } from './table/BridgesSummaryOthersTable'
import { BridgesSummarySingleChainTable } from './table/BridgesSummarySinglechainTable'

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
