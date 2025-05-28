import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedBridgeEntries } from '~/pages/bridges/utils/group-by-bridge-tabs'
import type { BridgesArchivedEntry } from '~/server/features/bridges/get-bridges-archived-entries'
import { BridgesHeader } from '../components/bridges-header'
import { BridgesArchivedTables } from './components/bridges-archived-tables'

interface Props extends AppLayoutProps {
  entries: TabbedBridgeEntries<BridgesArchivedEntry>
}

export function BridgesArchivedPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <TableFilterContextProvider>
          <BridgesHeader>Archived</BridgesHeader>
          <BridgesArchivedTables {...entries} />
        </TableFilterContextProvider>{' '}
      </SideNavLayout>
    </AppLayout>
  )
}
