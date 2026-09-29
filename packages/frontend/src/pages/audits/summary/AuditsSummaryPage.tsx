import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { AuditsSummaryEntry } from '~/server/features/audits/types'
import { AuditStatusLegend } from '../components/AuditStatusLegend'
import { AuditsSummaryTable } from './components/AuditsSummaryTable'

interface Props extends AppLayoutProps {
  entries: AuditsSummaryEntry[]
}

export function AuditsSummaryPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Comparison of the smart contract code deployed onchain with the code covered by public audit reports. Each deployed contract is split into units (contracts, interfaces, libraries) and every unit is matched against the audited sources.">
          Audits
        </MainPageHeader>
        <AuditStatusLegend className="mb-2 px-2" />
        <AuditsSummaryTable entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
