import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import AboutUs from '../../../../src/app/(side-nav)/about-us/page'

export function AboutUsPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <AboutUs />
      </SideNavLayout>
    </AppLayout>
  )
}
