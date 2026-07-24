import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DefiSummaryEntry } from '~/server/features/defi/getDefiSummaryEntries'
import { DefiSummaryTable } from './components/DefiSummaryTable'

interface Props extends AppLayoutProps {
  entries: DefiSummaryEntry[]
}

export function DefiSummaryPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Overview of DeFi protocols tracked by L2BEAT.">
          DeFi
        </MainPageHeader>
        <DefiSummaryTable entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
