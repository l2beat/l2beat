import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import type { TabbedBridgeEntries } from '../../utils/group-by-bridge-tabs'
import { BridgesArchivedTable } from './table/bridges-archived-table'

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
