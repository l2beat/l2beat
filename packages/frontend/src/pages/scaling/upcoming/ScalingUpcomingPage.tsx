import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/getScalingUpcomingEntries'
import { ScalingUpcomingTables } from './components/ScalingUpcomingTables'

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
