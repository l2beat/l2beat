import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2RiskEntry } from '~/server/features/layer2s/risks/getL2RiskEntries'
import { L2RiskTables } from './components/L2RiskTables'

interface Props extends AppLayoutProps {
  entries: TabbedL2Entries<L2RiskEntry>
}

export function L2RiskPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Risk Analysis</MainPageHeader>
        <TableFilterContextProvider>
          <L2RiskTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
