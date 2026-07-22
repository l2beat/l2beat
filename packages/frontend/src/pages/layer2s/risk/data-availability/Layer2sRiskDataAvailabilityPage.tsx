import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sRiskDaEntry } from '~/server/features/layer2s/risks/data-availability/getLayer2sRiskDaEntries'
import { Layer2sRiskDaTables } from './components/Layer2sRiskDaTables'

interface Props extends AppLayoutProps {
  entries: TabbedLayer2sEntries<Layer2sRiskDaEntry>
}

export function Layer2sRiskDataAvailabilityPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Data Availability</MainPageHeader>
        <TableFilterContextProvider>
          <Layer2sRiskDaTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
