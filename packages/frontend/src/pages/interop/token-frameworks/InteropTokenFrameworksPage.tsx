import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {}

export function InteropTokenFrameworksPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Comparing five major multichain token frameworks covered in LI.FI's analysis. Data is sourced from L2BEAT's interop tracking infrastructure. Claims from the original article">
          Token frameworks
        </MainPageHeader>
      </SideNavLayout>
    </AppLayout>
  )
}
