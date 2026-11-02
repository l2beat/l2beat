import { MainPageHeader } from '~/components/MainPageHeader'
import {
  type BadgeLookup,
  BadgeLookupProvider,
} from '~/components/projects/BadgeLookup'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2RiskDaEntry } from '~/server/features/layer2s/risks/data-availability/getL2RiskDaEntries'
import { L2RiskDaTables } from './components/L2RiskDaTables'

interface Props extends AppLayoutProps {
  badgeLookup: BadgeLookup
  entries: TabbedL2Entries<L2RiskDaEntry>
}

export function L2RiskDataAvailabilityPage({
  entries,
  badgeLookup,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <BadgeLookupProvider lookup={badgeLookup}>
        <SideNavLayout>
          <MainPageHeader>Data Availability</MainPageHeader>
          <TableFilterContextProvider>
            <L2RiskDaTables {...entries} />
          </TableFilterContextProvider>
        </SideNavLayout>
      </BadgeLookupProvider>
    </AppLayout>
  )
}
