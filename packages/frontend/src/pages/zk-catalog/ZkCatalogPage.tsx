import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { ZkCatalogPage as NextZkCatalogPage } from '~/app/(side-nav)/zk-catalog/_page'
import type { ZkCatalogEntry } from '~/app/(side-nav)/zk-catalog/_utils/get-zk-catalog-entries'
import { AppLayout, type AppLayoutProps } from '~/app/_layout'

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
