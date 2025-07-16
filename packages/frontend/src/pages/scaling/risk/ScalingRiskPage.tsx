import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/getScalingRiskEntries'
import { ScalingRiskTables } from './components/ScalingRiskTables'

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
