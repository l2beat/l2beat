import { MainPageHeader } from '~/components/MainPageHeader'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { OssificationEntry } from '~/server/features/projects/ossification/getOssificationEntries'
import { L2RiskOssificationTable } from './components/table/L2RiskOssificationTable'

interface Props extends AppLayoutProps {
  entries: OssificationEntry[]
}

export function L2RiskOssificationPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Ossification measures how battle-tested the code securing a project is. Contracts classified as critical by our research team form one project-wide perimeter; deploying or critically changing any of them resets the project clock, and ossification grows the longer the perimeter stays unchanged. The battle-tested exposure is the value secured summed up over that unchanged period — the implicit bug bounty the code has withstood, in dollar-years. The comparison spans scaling, privacy, and DeFi projects that our team has classified so far.">
          Ossification
        </MainPageHeader>
        <TableSortingProvider initialSort={{ id: '#', desc: false }}>
          <L2RiskOssificationTable entries={entries} />
        </TableSortingProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
