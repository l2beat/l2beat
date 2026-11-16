import { MainPageHeader } from '~/components/MainPageHeader'
import {
  type BadgeLookup,
  BadgeLookupProvider,
} from '~/components/projects/BadgeLookup'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { L2ArchivedTableSection } from './components/L2ArchivedTableSection'

interface Props extends AppLayoutProps {
  badgeLookup: BadgeLookup
  entries: L2ArchivedEntry[]
}

export function L2ArchivedPage({ entries, badgeLookup, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <BadgeLookupProvider lookup={badgeLookup}>
        <SideNavLayout>
          <MainPageHeader>Archived</MainPageHeader>
          <TableFilterContextProvider>
            <L2ArchivedTableSection entries={entries} />
          </TableFilterContextProvider>
        </SideNavLayout>
      </BadgeLookupProvider>
    </AppLayout>
  )
}
