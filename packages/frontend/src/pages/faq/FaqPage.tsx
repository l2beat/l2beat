import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import NextFaqPage from '../../app/(side-nav)/faq/page'

export function FaqPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextFaqPage />
      </SideNavLayout>
    </AppLayout>
  )
}
