import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sRiskEntry } from '~/server/features/layer2s/risks/getLayer2sRiskEntries'
import { Layer2sRiskTables } from './components/Layer2sRiskTables'

interface Props extends AppLayoutProps {
  entries: TabbedLayer2sEntries<Layer2sRiskEntry>
}

export function Layer2sRiskPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Risk Analysis</MainPageHeader>
        <TableFilterContextProvider>
          <Layer2sRiskTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
