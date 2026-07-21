import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sCostsEntry } from '~/server/features/layer2s/costs/getLayer2sCostsEntries'
import { CostsHeader } from './components/CostsHeader'
import { CostsMetricContextProvider } from './components/CostsMetricContext'
import { CostsTimeRangeContextProvider } from './components/CostsTimeRangeContext'
import { CostsUnitContextProvider } from './components/CostsUnitContext'
import { Layer2sCostsTabs } from './components/Layer2sCostsTabs'

interface Props extends AppLayoutProps {
  entries: TabbedLayer2sEntries<Layer2sCostsEntry>
  milestones: Milestone[]
  queryState: DehydratedState
}

export function Layer2sCostsPage({
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
                  <Layer2sCostsTabs {...entries} milestones={milestones} />
                </CostsMetricContextProvider>
              </CostsUnitContextProvider>
            </CostsTimeRangeContextProvider>
          </TableFilterContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
