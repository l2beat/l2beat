import { CustomLink } from '~/components/link/CustomLink'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { env } from '~/env'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
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
        {!env.CLIENT_SIDE_ZK_CATALOG_V2 ? (
          <WorkInProgressNotice />
        ) : (
          <>
            <TableFilterContextProvider>
              <div className="mb-4">
                <TableFilters entries={props.entries} />
              </div>
              <ZkCatalogTable entries={props.entries} />
            </TableFilterContextProvider>
            <p className="mt-2 text-balance text-center text-paragraph-15 text-secondary">
              We appreciate your patience as we work to improve your experience.
              <br />
              The previous version of ZK Catalog can be found{' '}
              <CustomLink href="/zk-catalog/v1">here</CustomLink>.
            </p>
          </>
        )}
      </SideNavLayout>
    </AppLayout>
  )
}
