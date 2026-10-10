import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

export function BlobsPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Blobs</MainPageHeader>
        <PrimaryCard className="flex min-h-80 flex-col items-center justify-center gap-2 text-center">
          <h2 className="font-bold text-heading-24">Coming soon</h2>
          <p className="text-paragraph-15 text-secondary md:text-paragraph-16">
            Blob usage on Ethereum, broken down by the projects that post them.
          </p>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
