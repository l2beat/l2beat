import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ChartRange } from '~/utils/range/range'
import { PrivacySummaryChartsSection } from './components/PrivacySummaryChartsSection'
import { PrivacySummaryTable } from './components/PrivacySummaryTable'
import type { PrivacySummaryEntry } from './getPrivacySummaryData'

interface Props extends AppLayoutProps {
  entries: PrivacySummaryEntry[]
  defaultChartRange: ChartRange
  queryState: DehydratedState
}

export function PrivacySummaryPage({
  entries,
  defaultChartRange,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader description="Daily aggregated privacy flows and live balances sourced from the configured onchain metric definitions for tracked privacy protocols.">
            Privacy Dashboard
          </MainPageHeader>
          <PrivacySummaryChartsSection defaultRange={defaultChartRange} />
          <PrimaryCard className="mt-4 p-0 md:p-0">
            <div className="border-divider border-b px-4 py-3 md:px-6 md:py-4">
              <h2 className="font-bold text-lg md:text-xl">Overview</h2>
              <p className="mt-2 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-15">
                Per-protocol balances and recent deposit activity across all
                tracked privacy buckets and assets.
              </p>
            </div>
            <div className="px-4 pb-2 md:px-6 md:pb-3">
              <PrivacySummaryTable entries={entries} />
            </div>
          </PrimaryCard>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
