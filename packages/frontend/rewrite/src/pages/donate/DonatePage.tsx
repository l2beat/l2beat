import { DonatePage as NextDonatePage } from '~/app/(side-nav)/donate/_page'
import type { SideNavLayoutProps } from '~/app/(side-nav)/side-nav-layout'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps, SideNavLayoutProps {
  qrCodeUrl: string
}

export function DonatePage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <NextDonatePage gitcoinOption={false} qrCodeUrl={props.qrCodeUrl} />
      </SideNavLayout>
    </AppLayout>
  )
}
