import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import { ScalingCompareCharts } from './components/ScalingCompareCharts'
import type { CompareChartState } from './utils/compareChartState'

interface Props extends AppLayoutProps {
  allProjects: CompareProjectEntry[]
  initialState: CompareChartState
  defaultProjectSlugs: string[]
  initialChartRange: ChartRange
  /** Only present for the default view; customized URLs load client-side. */
  queryState: DehydratedState | undefined
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
          <MainPageHeader description="Compare Ethereum scaling projects across metrics. Add charts to see value secured, activity, costs, and data posted side by side, and share the exact view with a link.">
            Compare Projects
          </MainPageHeader>
          <ScalingCompareCharts
            allProjects={allProjects}
            initialState={initialState}
            defaultProjectSlugs={defaultProjectSlugs}
            initialChartRange={initialChartRange}
          />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
