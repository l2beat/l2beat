import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { LivenessHeader } from './components/liveness-header'
import { LivenessTimeRangeContextProvider } from './components/liveness-time-range-context'
import { ScalingLivenessTables } from './components/scaling-liveness-tables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingLivenessEntry>
}

export function ScalingLivenessPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <LivenessTimeRangeContextProvider>
          <LivenessHeader />
          <TableFilterContextProvider>
            <ScalingLivenessTables {...entries} />
          </TableFilterContextProvider>
        </LivenessTimeRangeContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
