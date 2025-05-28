import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { ScalingArchivedTables } from './components/scaling-archived-tables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingArchivedEntry>
}

export function ScalingArchivedPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Archived</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingArchivedTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
