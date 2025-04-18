import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { RiskPage as NextRiskPage } from '~/app/(side-nav)/scaling/risk/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingRiskEntry>
}

export function RiskPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextRiskPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
