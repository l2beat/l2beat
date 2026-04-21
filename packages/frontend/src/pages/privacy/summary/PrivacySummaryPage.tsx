import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PrivacySummaryTable } from './components/PrivacySummaryTable'
import type { PrivacySummaryEntry } from './getPrivacySummaryData'

interface Props extends AppLayoutProps {
  entries: PrivacySummaryEntry[]
  overview: {
    projectCount: number
    totalValueSecuredUsd: number
    deposits30d: number
  }
}

export function PrivacySummaryPage({ entries, overview, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="A lightweight demo dashboard for live privacy-protocol balances and deposit counts sourced from the configured onchain metric definitions.">
          Privacy Dashboard
        </MainPageHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <PrimaryCard>
            <ProjectSummaryStat
              title="Protocols"
              value={formatInteger(overview.projectCount)}
              valueClassName="text-heading-28"
            />
          </PrimaryCard>
          <PrimaryCard>
            <ProjectSummaryStat
              title="Total Value Locked"
              value={formatCurrency(overview.totalValueSecuredUsd, 'usd')}
              valueClassName="text-heading-28"
            />
          </PrimaryCard>
          <PrimaryCard>
            <ProjectSummaryStat
              title="Total Deposits 30D"
              value={formatInteger(overview.deposits30d)}
              valueClassName="text-heading-28"
            />
          </PrimaryCard>
        </div>
        <PrimaryCard className="mt-4 p-0 md:p-0">
          <div className="border-divider border-b px-4 py-4 md:px-6">
            <h2 className="font-bold text-heading-24">Overview</h2>
            <p className="mt-2 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-15">
              Total value locked is aggregated across all configured assets
              using the hardcoded demo prices, while deposit counts and 30-day
              deposit value are aggregated across all tracked buckets.
            </p>
          </div>
          <PrivacySummaryTable entries={entries} />
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
