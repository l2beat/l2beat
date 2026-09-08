import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { AuditsProjectDetails } from '~/server/features/audits/types'
import { AuditCoverageStats } from './components/AuditCoverageStats'
import { AuditReportsList } from './components/AuditReportsList'
import { AuditsProjectHeader } from './components/AuditsProjectHeader'
import { ContractCoverageList } from './components/ContractCoverageList'

interface Props extends AppLayoutProps {
  details: AuditsProjectDetails
  queryState: DehydratedState
}

export function AuditsProjectPage({ details, queryState, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <div className="flex flex-col gap-4 pt-6 max-md:px-4 lg:pt-4">
            <AuditsProjectHeader details={details} />
            <PrimaryCard>
              <AuditCoverageStats
                coverage={details.coverage}
                uniqueUnits={details.uniqueUnits}
                contracts={details.contracts}
                contractsWithoutSource={details.contractsWithoutSource}
              />
            </PrimaryCard>
            <PrimaryCard>
              <AuditReportsList reports={details.reports} />
            </PrimaryCard>
            <PrimaryCard>
              <ContractCoverageList
                slug={details.slug}
                contracts={details.contractEntries}
              />
            </PrimaryCard>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
