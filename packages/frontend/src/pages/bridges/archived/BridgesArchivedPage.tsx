import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedBridgeEntries } from '~/pages/bridges/utils/groupByBridgeTabs'
import type { BridgesArchivedEntry } from '~/server/features/bridges/getBridgesArchivedEntries'
import { BridgesHeader } from '../components/BridgesHeader'
import { BridgesArchivedTables } from './components/BridgesArchivedTables'

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
