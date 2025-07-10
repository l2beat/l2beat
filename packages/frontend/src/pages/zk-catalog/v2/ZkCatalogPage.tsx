import { env } from '~/env'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ZkCatalogEntry } from '../../../server/features/zk-catalog/getZkCatalogEntries'
import { ZkCatalogHeader } from '../v1/components/ZkCatalogHeader'
import { WorkInProgressNotice } from './components/WorkInProgressNotice'
import { ZkCatalogTable } from './table/ZkCatalogTable'

interface Props extends AppLayoutProps {
  entries: ZkCatalogEntry[]
}

export function ZkCatalogPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <ZkCatalogHeader />
        {!env.NEXT_PUBLIC_ZK_CATALOG_V2 ? (
          <WorkInProgressNotice />
        ) : (
          <ZkCatalogTable entries={props.entries} />
        )}
      </SideNavLayout>
    </AppLayout>
  )
}
