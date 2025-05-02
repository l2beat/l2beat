import { DataAvailabilityThroughputPage as NextDataAvailabilityThroughputPage } from '~/app/(side-nav)/data-availability/throughput/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'

interface Props extends AppLayoutProps {
  entries: DaThroughputEntry[]
}

export function DataAvailabilityThroughputPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextDataAvailabilityThroughputPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
