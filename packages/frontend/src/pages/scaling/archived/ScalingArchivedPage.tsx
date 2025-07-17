import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/getScalingArchivedEntries'
import { ScalingArchivedTables } from './components/ScalingArchivedTables'

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
