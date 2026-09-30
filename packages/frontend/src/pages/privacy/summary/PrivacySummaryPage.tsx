import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { ChartRange } from '~/utils/range/range'
import { PrivacySummaryChartsSection } from './components/PrivacySummaryChartsSection'
import { PrivacySummaryGrid } from './components/PrivacySummaryGrid'

interface Props extends AppLayoutProps {
  entries: PrivacySummaryEntry[]
  defaultChartRange: ChartRange
  bestPracticesBannerImageUrl: string
  queryState: DehydratedState
}

export function PrivacySummaryPage({
  entries,
  defaultChartRange,
  bestPracticesBannerImageUrl,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader description="Analysis of privacy protocols on Ethereum focusing on CROPS principles (Censorship Resistance, Openness, Privacy, Security).">
            Privacy
          </MainPageHeader>
          <PrivacySummaryChartsSection
            projects={entries
              .filter((e) => e.isTracked || e.hasTvl)
              .map((e) => ({ id: e.id, name: e.name, hasTvl: e.hasTvl }))}
            defaultRange={defaultChartRange}
          />
          <PrivacySummaryGrid
            entries={entries}
            bestPracticesBannerImageUrl={bestPracticesBannerImageUrl}
          />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
