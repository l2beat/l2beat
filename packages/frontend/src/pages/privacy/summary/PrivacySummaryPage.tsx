import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PRIVACY_SUMMARY_DESCRIPTION } from '~/consts/summaryPageDescriptions'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyBestPracticesBanner } from './components/PrivacyBestPracticesBanner'
import { PrivacySummaryChartsSection } from './components/PrivacySummaryChartsSection'
import { PrivacySummaryTables } from './components/PrivacySummaryTables'
import type { PrivacyTvlBreakdownProject } from './components/PrivacyTvlBreakdownChart'
import type { PrivacySummaryGroup } from './privacySummaryGroups'

interface Props extends AppLayoutProps {
  groups: PrivacySummaryGroup[]
  chartProjects: PrivacyTvlBreakdownProject[]
  defaultChartRange: ChartRange
  bestPracticesBannerImageUrl: string
  queryState: DehydratedState
}

export function PrivacySummaryPage({
  groups,
  chartProjects,
  defaultChartRange,
  bestPracticesBannerImageUrl,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader description={PRIVACY_SUMMARY_DESCRIPTION}>
            Privacy
          </MainPageHeader>
          <PrivacySummaryChartsSection
            projects={chartProjects}
            defaultRange={defaultChartRange}
          />
          <PrivacySummaryTables groups={groups} />
          <PrivacyBestPracticesBanner
            backgroundImage={bestPracticesBannerImageUrl}
          />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
