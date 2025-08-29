import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import { TableFilters } from '~/components/table/filters/TableFilters'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/getScalingUpcomingEntries'
import { ScalingUpcomingTable } from './components/table/ScalingUpcomingTable'

interface Props extends AppLayoutProps {
  entries: ScalingUpcomingEntry[]
}

export function ScalingUpcomingPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Upcoming</MainPageHeader>
        <TableFilterContextProvider>
          <TableFilters entries={entries} />
          <ScalingUpcomingTable entries={entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
