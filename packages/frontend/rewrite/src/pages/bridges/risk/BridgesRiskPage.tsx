import { BridgesRiskPage as NextRiskPage } from '~/app/(side-nav)/bridges/risk/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { BridgesRiskEntry } from '~/server/features/bridges/get-bridges-risk-entries'

interface Props extends AppLayoutProps {
  entries: BridgesRiskEntry[]
}

export function BridgesRiskPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextRiskPage entries={props.entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
