import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { externalLinks } from '~/consts/externalLinks'
import { useTracking } from '~/hooks/useTracking'
import { CustomLinkIcon } from '~/icons/Outlink'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import type { ZkCatalogEntry } from '../../../server/features/zk-catalog/getZkCatalogEntries'
import { ZkCatalogHeader } from './components/ZkCatalogHeader'
import { ZkCatalogTvsChart } from './components/ZkCatalogTvsChart'
import { ZkCatalogTable } from './table/ZkCatalogTable'

interface Props extends AppLayoutProps {
  entries: ZkCatalogEntry[]
  defaultChartRange: ChartRange
  queryState: DehydratedState
}

export function ZkCatalogPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={props.queryState}>
        <SideNavLayout>
          <ZkCatalogHeader />
          <ZkCatalogTvsChart
            provers={props.entries}
            defaultRange={props.defaultChartRange}
          />
          <TableFilterContextProvider>
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 max-md:mt-4 max-md:px-4">
              <TableFilters entries={props.entries} />
              <TrustedSetupFrameworkLink />
            </div>
            <ZkCatalogTable entries={props.entries} />
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
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
        'flex h-8 w-fit items-center gap-1.5 whitespace-nowrap rounded-lg bg-surface-primary px-3 font-medium text-primary text-xs leading-none transition-colors hover:bg-surface-secondary md:text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
      )}
      onClick={() => {
        track('trustedSetupFrameworkSelected')
      }}
    >
      Trusted setups risk framework
      <CustomLinkIcon className="size-3.5 shrink-0 fill-secondary" />
    </a>
  )
}
