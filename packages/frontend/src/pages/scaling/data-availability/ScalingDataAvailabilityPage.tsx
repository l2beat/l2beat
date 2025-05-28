import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { ScalingDaTables } from './components/scaling-da-tables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingDaEntry>
}

export function ScalingDataAvailabilityPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Data Availability</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingDaTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
