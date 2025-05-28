import { ZkCatalogProjectPage as NextZkCatalogProjectPage } from '~/app/(side-nav)/zk-catalog/[slug]/_page'
import type { ZkCatalogProjectDetails } from '~/app/(side-nav)/zk-catalog/[slug]/_utils/get-zk-catalog-project-details'
import { AppLayout, type AppLayoutProps } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'

interface Props extends AppLayoutProps {
  projectDetails: ZkCatalogProjectDetails
}

export function ZkCatalogProjectPage({ projectDetails, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextZkCatalogProjectPage projectDetails={projectDetails} />
      </SideNavLayout>
    </AppLayout>
  )
}
