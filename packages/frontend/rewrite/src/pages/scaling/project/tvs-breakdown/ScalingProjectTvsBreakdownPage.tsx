import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ScalingProjectTvsBreakdownPage as NextScalingProjectTvsBreakdownPage } from '~/app/(top-nav)/scaling/projects/[slug]/tvs-breakdown/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'

interface Props extends AppLayoutProps {
  tvsBreakdownData: ScalingProjectTvsBreakdownData
  queryState: DehydratedState
}

export function ScalingProjectTvsBreakdownPage({
  tvsBreakdownData,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TopNavLayout>
          <NextScalingProjectTvsBreakdownPage {...tvsBreakdownData} />
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
