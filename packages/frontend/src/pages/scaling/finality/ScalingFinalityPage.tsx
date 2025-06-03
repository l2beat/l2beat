import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingFinalityEntry } from '~/server/features/scaling/finality/getScalingFinalityEntries'
import { FinalityHeader } from './components/FinalityHeader'
import { ScalingFinalityTables } from './components/ScalingFinalityTables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingFinalityEntry>
}

export function ScalingFinalityPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <FinalityHeader />
        <TableFilterContextProvider>
          <ScalingFinalityTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
