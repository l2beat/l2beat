import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { ZkCatalogProjectPage as NextZkCatalogProjectPage } from '~/app/(side-nav)/zk-catalog/[slug]/_page'
import type { ZkCatalogProjectDetails } from '~/app/(side-nav)/zk-catalog/[slug]/_utils/get-zk-catalog-project-details'
import { AppLayout, type AppLayoutProps } from '~/app/_layout'

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
