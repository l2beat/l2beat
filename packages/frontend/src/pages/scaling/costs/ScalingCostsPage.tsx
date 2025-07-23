import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/getScalingCostsEntries'
import { CostsHeader } from './components/CostsHeader'
import { CostsMetricContextProvider } from './components/CostsMetricContext'
import { CostsTimeRangeContextProvider } from './components/CostsTimeRangeContext'
import { CostsUnitContextProvider } from './components/CostsUnitContext'
import { ScalingCostsTabs } from './components/ScalingCostsTabs'

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
