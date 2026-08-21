import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2LivenessEntry } from '~/server/features/layer2s/liveness/getL2LivenessEntries'
import { L2LivenessTables } from './components/L2LivenessTables'
import { LivenessHeader } from './components/LivenessHeader'
import { LivenessTimeRangeContextProvider } from './components/LivenessTimeRangeContext'
import {
  type ProjectWithAnomaly,
  RecentAnomalies,
} from './components/RecentAnomalies'

interface Props extends AppLayoutProps {
  entries: TabbedL2Entries<L2LivenessEntry>
  projectsWithAnomalies: ProjectWithAnomaly[]
}

export function L2LivenessPage({
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
            <L2LivenessTables {...entries} />
          </TableFilterContextProvider>
        </LivenessTimeRangeContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
