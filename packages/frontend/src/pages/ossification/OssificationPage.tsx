import { MainPageHeader } from '~/components/MainPageHeader'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { OssificationSummaryEntry } from '~/server/features/projects/ossification/getOssificationEntries'
import { OssificationTable } from './components/table/OssificationTable'

interface Props extends AppLayoutProps {
  entries: OssificationSummaryEntry[]
}

export function OssificationPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Ossification measures how battle-tested the code securing a project is: the share of recorded code-bug exploits (published, onchain-verified dataset) whose exploited code was younger than the project's unchanged critical perimeter. Battle-tested exposure is the value secured summed over that unchanged period — the implicit bug bounty the code has withstood. The comparison spans Layer 2, privacy, and DeFi projects classified by our team so far.">
          Ossification
        </MainPageHeader>
        <TableSortingProvider initialSort={{ id: '#', desc: false }}>
          <OssificationTable entries={entries} />
        </TableSortingProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
