import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import { RiskPage as NextRiskPage } from '~/app/(side-nav)/scaling/risk/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingRiskEntry>
}

export function ScalingRiskPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextRiskPage entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
