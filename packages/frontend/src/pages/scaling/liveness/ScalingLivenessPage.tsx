import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { LivenessHeader } from './components/LivenessHeader'
import { LivenessTimeRangeContextProvider } from './components/LivenessTimeRangeContext'
import { OngoingAnomaliesSection } from './components/OngoingAnomaliesSection'
import { ScalingLivenessTables } from './components/ScalingLivenessTables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingLivenessEntry>
  ongoingAnomalies: (LivenessAnomaly & {
    project: { name: string; slug: string }
  })[]
}

export function ScalingLivenessPage({
  entries,
  ongoingAnomalies,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <LivenessTimeRangeContextProvider>
          <LivenessHeader />

          <OngoingAnomaliesSection anomalies={ongoingAnomalies} />
          <TableFilterContextProvider>
            <ScalingLivenessTables {...entries} />
          </TableFilterContextProvider>
        </LivenessTimeRangeContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
