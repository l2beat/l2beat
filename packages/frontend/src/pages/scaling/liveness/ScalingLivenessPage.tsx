import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { AppLayout } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import { LivenessHeader } from './components/LivenessHeader'
import { LivenessTimeRangeContextProvider } from './components/LivenessTimeRangeContext'
import {
  OngoingAnomaliesSection,
  type ProjectWithAnomaly,
} from './components/OngoingAnomaliesSection'
import { ScalingLivenessTables } from './components/ScalingLivenessTables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingLivenessEntry>
  projectsWithAnomalies: ProjectWithAnomaly[]
}

export function ScalingLivenessPage({
  entries,
  projectsWithAnomalies,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <LivenessTimeRangeContextProvider>
          <LivenessHeader />
          <OngoingAnomaliesSection
            projectsWithAnomalies={projectsWithAnomalies}
            className="max-md:mt-4 md:mb-6"
          />
          <TableFilterContextProvider>
            <ScalingLivenessTables {...entries} />
          </TableFilterContextProvider>
        </LivenessTimeRangeContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
