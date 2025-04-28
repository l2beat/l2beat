import { ScalingProjectTvsBreakdownPage as NextScalingProjectTvsBreakdownPage } from '~/app/(top-nav)/scaling/projects/[slug]/tvs-breakdown/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'

interface Props extends AppLayoutProps {
  tvsBreakdownData: ScalingProjectTvsBreakdownData
}

export function ScalingProjectTvsBreakdownPage({
  tvsBreakdownData,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <TopNavLayout>
        <NextScalingProjectTvsBreakdownPage {...tvsBreakdownData} />
      </TopNavLayout>
    </AppLayout>
  )
}
