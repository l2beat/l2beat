import type { SideNavLayoutProps } from '~/app/(side-nav)/side-nav-layout'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import AboutUs from '../../../../src/app/(side-nav)/about-us/page'

interface Props extends AppLayoutProps, SideNavLayoutProps {}

export function AboutUsPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <AboutUs />
      </SideNavLayout>
    </AppLayout>
  )
}
