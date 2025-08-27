import { MainPageHeader } from '~/components/MainPageHeader'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TvsBreakdownTokenEntry } from '~/server/features/scaling/tvs/breakdown/getAllTokenEntries'
import { RequestTokenBox } from '../../project/tvs-breakdown/components/RequestTokenBox'
import { TvsBreakdownTokenTable } from './TvsBreakdownTokenTable'

interface Props extends AppLayoutProps {
  entries: TvsBreakdownTokenEntry[]
}

export function ScalingTvsBreakdownPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Global TVS Breakdown</MainPageHeader>
        <div
          className="smooth-scroll group/section-wrapper md:space-y-6"
          data-project-page={true}
        >
          <TableFilterContextProvider>
            <TvsBreakdownTokenTable entries={entries} />
          </TableFilterContextProvider>
        </div>
        <RequestTokenBox />
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
