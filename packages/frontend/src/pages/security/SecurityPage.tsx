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

export function SecurityPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Ossification measures how battle-tested the code securing a project is. Contracts classified as critical by our research team form one project-wide perimeter; deploying or critically changing any of them resets the project clock. Ossification N means the unchanged perimeter has outlived the code age of N% of recorded code-bug exploits in our published, onchain-verified incident dataset. The battle-tested exposure is the value secured summed up over that unchanged period — the implicit bug bounty the code has withstood, in dollar-years. The comparison spans Layer 2, privacy, and DeFi projects that our team has classified so far.">
          Security
        </MainPageHeader>
        <TableSortingProvider initialSort={{ id: '#', desc: false }}>
          <OssificationTable entries={entries} />
        </TableSortingProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
