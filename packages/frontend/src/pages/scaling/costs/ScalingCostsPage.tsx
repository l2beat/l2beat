import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/group-by-scaling-tabs'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { CostsHeader } from './components/costs-header'
import { CostsMetricContextProvider } from './components/costs-metric-context'
import { CostsTimeRangeContextProvider } from './components/costs-time-range-context'
import { CostsUnitContextProvider } from './components/costs-unit-context'
import { ScalingCostsTabs } from './components/scaling-costs-tabs'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<ScalingCostsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function ScalingCostsPage({
  entries,
  milestones,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <TableFilterContextProvider>
            <CostsTimeRangeContextProvider>
              <CostsUnitContextProvider>
                <CostsMetricContextProvider>
                  <CostsHeader />
                  <ScalingCostsTabs {...entries} milestones={milestones} />
                </CostsMetricContextProvider>
              </CostsUnitContextProvider>
            </CostsTimeRangeContextProvider>
          </TableFilterContextProvider>{' '}
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
