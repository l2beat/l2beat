import type { SideNavLayoutProps } from '~/app/(side-nav)/side-nav-layout'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps, SideNavLayoutProps {}

export function ActivityPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <div>Activity</div>
      </SideNavLayout>
    </AppLayout>
  )
}
