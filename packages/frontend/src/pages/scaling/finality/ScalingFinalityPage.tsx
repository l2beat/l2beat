import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingFinalityEntry } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import { FinalityHeader } from './components/finality-header'
import { ScalingFinalityTables } from './components/scaling-finality-tables'

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
