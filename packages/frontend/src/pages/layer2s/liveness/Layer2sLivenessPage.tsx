import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sLivenessEntry } from '~/server/features/layer2s/liveness/getLayer2sLivenessEntries'
import { Layer2sLivenessTables } from './components/Layer2sLivenessTables'
import { LivenessHeader } from './components/LivenessHeader'
import { LivenessTimeRangeContextProvider } from './components/LivenessTimeRangeContext'
import {
  type ProjectWithAnomaly,
  RecentAnomalies,
} from './components/RecentAnomalies'

interface Props extends AppLayoutProps {
  entries: TabbedLayer2sEntries<Layer2sLivenessEntry>
  projectsWithAnomalies: ProjectWithAnomaly[]
}

export function Layer2sLivenessPage({
  entries,
  projectsWithAnomalies,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <LivenessTimeRangeContextProvider>
          <LivenessHeader />
          <RecentAnomalies
            projectsWithAnomalies={projectsWithAnomalies}
            className="max-md:mt-4 md:mb-6"
          />
          <TableFilterContextProvider>
            <Layer2sLivenessTables {...entries} />
          </TableFilterContextProvider>
        </LivenessTimeRangeContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
