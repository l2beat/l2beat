import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { externalLinks } from '~/consts/externalLinks'
import { env } from '~/env'
import { useTracking } from '~/hooks/useTracking'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
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
            <div className="bg-link/20 p-4 text-paragraph-14 max-md:mt-2 md:mb-4 md:rounded-lg md:text-paragraph-16">
              More detailed information about each proof system will be
              available soon. Stay tuned!
            </div>
            <TableFilterContextProvider>
              <div className="mr-4 mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
                <TableFilters entries={props.entries} />
                <TrustedSetupFrameworkLink />
              </div>
              <ZkCatalogTable entries={props.entries} />
            </TableFilterContextProvider>
          </>
        )}
      </SideNavLayout>
    </AppLayout>
  )
}

function TrustedSetupFrameworkLink() {
  const { track } = useTracking()
  return (
    <a
      href={externalLinks.articles.trustedSetupFramework}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'flex items-center gap-1 rounded-lg bg-linear-to-r from-purple-100 to-pink-100 font-semibold text-sm text-white',
        'h-8 w-fit px-2 py-1 max-md:ml-4',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
      onClick={() => {
        track('trustedSetupFrameworkSelected')
      }}
    >
      Trusted Setups Risk Framework
    </a>
  )
}
