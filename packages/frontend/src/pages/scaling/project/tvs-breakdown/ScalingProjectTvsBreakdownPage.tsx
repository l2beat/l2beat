import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ScalingProjectTvsBreakdownPage as NextScalingProjectTvsBreakdownPage } from '~/app/(top-nav)/scaling/projects/[slug]/tvs-breakdown/_page'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
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
