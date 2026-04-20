import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { externalLinks } from '~/consts/externalLinks'
import { useTracking } from '~/hooks/useTracking'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import type { ZkCatalogEntry } from '../../../server/features/zk-catalog/getZkCatalogEntries'
import { ZkCatalogHeader } from './components/ZkCatalogHeader'
import { ZkCatalogTable } from './table/ZkCatalogTable'

interface Props extends AppLayoutProps {
  entries: ZkCatalogEntry[]
}

export function ZkCatalogPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <ZkCatalogHeader />
        <TableFilterContextProvider>
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 max-md:mt-4 max-md:px-4">
            <TableFilters entries={props.entries} />
            <TrustedSetupFrameworkLink />
          </div>
          <ZkCatalogTable entries={props.entries} />
        </TableFilterContextProvider>
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
        'h-8 w-fit px-2 py-1',
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
