import { DataAvailabilityRiskPage as NextDataAvailabilityRiskPage } from '~/app/(side-nav)/data-availability/risk/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'

interface Props extends AppLayoutProps {
  publicSystems: DaRiskEntry[]
  customSystems: DaRiskEntry[]
}

export function DataAvailabilityRiskPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextDataAvailabilityRiskPage
          publicSystems={props.publicSystems}
          customSystems={props.customSystems}
        />
      </SideNavLayout>
    </AppLayout>
  )
}
