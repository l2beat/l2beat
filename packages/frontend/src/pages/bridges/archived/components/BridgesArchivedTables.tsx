import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { BridgesArchivedEntry } from '~/server/features/bridges/getBridgesArchivedEntries'
import type { TabbedBridgeEntries } from '../../utils/groupByBridgeTabs'
import { BridgesArchivedTable } from './table/BridgesArchivedTable'

type Props = TabbedBridgeEntries<BridgesArchivedEntry>
export function BridgesArchivedTables(props: Props) {
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
            <BridgesArchivedTable entries={entries.singleChain} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <BridgesArchivedTable entries={entries.others} isOthers />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
