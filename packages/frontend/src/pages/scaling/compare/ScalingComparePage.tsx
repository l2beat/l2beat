import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import { ScalingCompareChart } from './components/ScalingCompareChart'
import type { CompareChartState } from './utils/compareChartState'

interface Props extends AppLayoutProps {
  allProjects: CompareProjectEntry[]
  initialState: CompareChartState
  defaultProjectSlugs: string[]
  initialChartRange: ChartRange
  queryState: DehydratedState
}

export function ScalingComparePage({
  allProjects,
  initialState,
  defaultProjectSlugs,
  initialChartRange,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader description="Compare Ethereum scaling projects on a single chart. Pick up to 10 projects, switch between metrics, and share the exact view with a link.">
            Compare Projects
          </MainPageHeader>
          <PrimaryCard className="max-md:mt-4 md:mt-2">
            <ScalingCompareChart
              allProjects={allProjects}
              initialState={initialState}
              defaultProjectSlugs={defaultProjectSlugs}
              initialChartRange={initialChartRange}
            />
          </PrimaryCard>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
