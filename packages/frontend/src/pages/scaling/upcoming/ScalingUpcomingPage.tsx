import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { ScalingUpcomingTables } from './components/scaling-upcoming-tables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingUpcomingEntry>
}

export function ScalingUpcomingPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Upcoming</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingUpcomingTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
