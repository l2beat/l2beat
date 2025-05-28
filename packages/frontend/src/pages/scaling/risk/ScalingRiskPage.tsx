import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { ScalingRiskTables } from './components/scaling-risk-tables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingRiskEntry>
}

export function ScalingRiskPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Risk Analysis</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingRiskTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
