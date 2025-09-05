import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import {
  LivenessTimeRangeContextProvider,
  useLivenessTimeRangeContext,
} from '~/pages/scaling/liveness/components/LivenessTimeRangeContext'
import { LivenessTimeRangeControls } from '~/pages/scaling/liveness/components/LivenessTimeRangeControls'
import type { DaLivenessEntry } from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import { DaLivenessTable } from './components/table/DaLivenessTable'

interface Props extends AppLayoutProps {
  publicSystems: DaLivenessEntry[]
}

export function DataAvailabilityLivenessPage({
  publicSystems,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <LivenessTimeRangeContextProvider>
          <MainPageHeader>Liveness</MainPageHeader>
          <Controls />
          <DirectoryTabs defaultValue="public">
            <DirectoryTabsList>
              <DirectoryTabsTrigger value="public">
                Public <CountBadge>{publicSystems.length}</CountBadge>
              </DirectoryTabsTrigger>
            </DirectoryTabsList>
            <DirectoryTabsContent value="public">
              <DaLivenessTable items={publicSystems} />
            </DirectoryTabsContent>
          </DirectoryTabs>
        </LivenessTimeRangeContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}

function Controls() {
  const { timeRange, setTimeRange } = useLivenessTimeRangeContext()

  return (
    <LivenessTimeRangeControls
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      className="max-md:ml-4"
    />
  )
}
