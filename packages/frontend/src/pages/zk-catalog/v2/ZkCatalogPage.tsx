import { CustomLink } from '~/components/link/CustomLink'
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
            <TableFilterContextProvider>
              <div className="mr-4 mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
                <TableFilters entries={props.entries} />
                <TrustedSetupFrameworkLink />
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
      Trusted Setup Framework
    </a>
  )
}
