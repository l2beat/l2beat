import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { AuditsSummaryEntry } from '~/server/features/audits/types'
import { AuditsSummaryTable } from './components/AuditsSummaryTable'

interface Props extends AppLayoutProps {
  entries: AuditsSummaryEntry[]
}

export function AuditsSummaryPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Comparison of the smart contract code deployed onchain with the code covered by public audit reports.">
          Audits
        </MainPageHeader>
        <AuditsSummaryTable entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
