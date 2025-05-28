import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
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
