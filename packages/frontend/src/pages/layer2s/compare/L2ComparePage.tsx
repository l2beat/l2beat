import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import type { ChartRange } from '~/utils/range/range'
import { L2CompareCharts } from './components/L2CompareCharts'
import type { CompareChartState } from './utils/compareChartState'

interface Props extends AppLayoutProps {
  allProjects: CompareProjectEntry[]
  initialState: CompareChartState
  defaultProjectSlugs: string[]
  initialChartRange: ChartRange
  /** Only present for the default view; customized URLs load client-side. */
  queryState: DehydratedState | undefined
}

export function L2ComparePage({
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
          <MainPageHeader>Compare Projects</MainPageHeader>
          <L2CompareCharts
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
