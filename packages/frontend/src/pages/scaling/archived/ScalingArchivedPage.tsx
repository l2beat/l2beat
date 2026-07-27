import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/getScalingArchivedEntries'
import { ScalingArchivedTableSection } from './components/ScalingArchivedTableSection'

interface Props extends AppLayoutProps {
  entries: ScalingArchivedEntry[]
}

export function ScalingArchivedPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Archived</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingArchivedTableSection entries={entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
