import type { SideNavLayoutProps } from '~/app/(side-nav)/side-nav-layout'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import NextFaqPage from '../../../../src/app/(side-nav)/faq/page'

interface Props extends AppLayoutProps, SideNavLayoutProps {}

export function FaqPage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <NextFaqPage />
      </SideNavLayout>
    </AppLayout>
  )
}
