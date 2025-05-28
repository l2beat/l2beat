import type { DaSummaryEntry } from 'rewrite/src/server/features/data-availability/summary/get-da-summary-entries'
import type { ThroughputSummaryData } from 'rewrite/src/server/features/data-availability/throughput/get-da-throughput-summary'
import { DataAvailabilitySummaryPage as NextDataAvailabilitySummaryPage } from '~/app/(side-nav)/data-availability/summary/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  publicSystems: DaSummaryEntry[]
  customSystems: DaSummaryEntry[]
  throughputSummaryData: ThroughputSummaryData
}

export function DataAvailabilitySummaryPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextDataAvailabilitySummaryPage
          publicSystems={props.publicSystems}
          customSystems={props.customSystems}
          throughputSummaryData={props.throughputSummaryData}
        />
      </SideNavLayout>
    </AppLayout>
  )
}
