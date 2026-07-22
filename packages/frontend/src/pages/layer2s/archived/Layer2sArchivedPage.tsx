import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { Layer2sArchivedEntry } from '~/server/features/layer2s/archived/getLayer2sArchivedEntries'
import { Layer2sArchivedTableSection } from './components/Layer2sArchivedTableSection'

interface Props extends AppLayoutProps {
  entries: Layer2sArchivedEntry[]
}

export function Layer2sArchivedPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Archived</MainPageHeader>
        <TableFilterContextProvider>
          <Layer2sArchivedTableSection entries={entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
