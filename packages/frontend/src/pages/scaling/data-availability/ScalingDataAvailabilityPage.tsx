import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/getScalingDaEntries'
import { ScalingDaTables } from './components/ScalingDaTables'

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
