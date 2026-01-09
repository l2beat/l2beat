import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {}

export function InteropSummaryPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout fullWidth>
        <MainPageHeader>Ethereum Ecosystem Interop</MainPageHeader>
      </SideNavLayout>
    </AppLayout>
  )
}
