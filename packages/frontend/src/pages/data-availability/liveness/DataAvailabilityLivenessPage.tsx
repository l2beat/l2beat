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
import { PublicSystemInfo } from '../components/DaCategoryInfo'
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
          <MainPageHeader description="DA bridges liveness shows how actively different DA layers are posting data availability attestations to Ethereum, and whether there are any significant deviations from their usual submission schedule.">
            Liveness
          </MainPageHeader>
          <Controls />
          <DirectoryTabs defaultValue="public">
            <DirectoryTabsList>
              <DirectoryTabsTrigger value="public">
                Public <CountBadge>{publicSystems.length}</CountBadge>
              </DirectoryTabsTrigger>
            </DirectoryTabsList>
            <DirectoryTabsContent value="public">
              <PublicSystemInfo />
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
      className="max-md:mt-4 max-md:ml-4"
    />
  )
}
