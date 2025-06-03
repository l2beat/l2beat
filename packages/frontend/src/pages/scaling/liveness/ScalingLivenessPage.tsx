import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import { LivenessHeader } from './components/LivenessHeader'
import { LivenessTimeRangeContextProvider } from './components/LivenessTimeRangeContext'
import { ScalingLivenessTables } from './components/ScalingLivenessTables'

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
