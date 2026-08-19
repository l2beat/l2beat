import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedL2Entries } from '~/pages/layer2s/utils/groupByL2Tabs'
import type { L2CostsEntry } from '~/server/features/layer2s/costs/getL2CostsEntries'
import { CostsHeader } from './components/CostsHeader'
import { CostsMetricContextProvider } from './components/CostsMetricContext'
import { CostsTimeRangeContextProvider } from './components/CostsTimeRangeContext'
import { CostsUnitContextProvider } from './components/CostsUnitContext'
import { L2CostsTabs } from './components/L2CostsTabs'

interface Props extends AppLayoutProps {
  entries: TabbedL2Entries<L2CostsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function L2CostsPage({
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
                  <L2CostsTabs {...entries} milestones={milestones} />
                </CostsMetricContextProvider>
              </CostsUnitContextProvider>
            </CostsTimeRangeContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
