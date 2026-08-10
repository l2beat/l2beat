import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingRiskDaEntry } from '~/server/features/scaling/risks/data-availability/getScalingRiskDaEntries'
import { ScalingRiskDaTables } from './components/ScalingRiskDaTables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingRiskDaEntry>
}

export function ScalingRiskDataAvailabilityPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Data Availability</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingRiskDaTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
