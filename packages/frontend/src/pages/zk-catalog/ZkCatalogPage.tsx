import { ZkCatalogPage as NextZkCatalogPage } from '~/app/(side-nav)/zk-catalog/_page'
import type { ZkCatalogEntry } from '~/app/(side-nav)/zk-catalog/_utils/get-zk-catalog-entries'
import { AppLayout, type AppLayoutProps } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'

interface Props extends AppLayoutProps {
  entries: ZkCatalogEntry[]
}

export function ZkCatalogPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextZkCatalogPage entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
