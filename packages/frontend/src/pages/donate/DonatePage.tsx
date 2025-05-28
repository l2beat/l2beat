import { DonatePage as NextDonatePage } from '~/app/(side-nav)/donate/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  qrCodeUrl: string
}

export function DonatePage(props: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextDonatePage gitcoinOption={false} qrCodeUrl={props.qrCodeUrl} />
      </SideNavLayout>
    </AppLayout>
  )
}
