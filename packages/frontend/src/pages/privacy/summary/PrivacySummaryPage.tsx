import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { ChartRange } from '~/utils/range/range'
import { PrivacySummaryChartsSection } from './components/PrivacySummaryChartsSection'
import { PrivacySummaryTable } from './components/PrivacySummaryTable'

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
          <PrivacySummaryChartsSection
            projects={entries.map((e) => ({ id: e.id, name: e.name }))}
            defaultRange={defaultChartRange}
          />
          <PrivacySummaryTable entries={entries} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
