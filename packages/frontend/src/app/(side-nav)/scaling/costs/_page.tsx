import type { Milestone } from '@l2beat/config'
import type { ScalingCostsEntry } from 'rewrite/src/server/features/scaling/costs/get-scaling-costs-entries'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { CostsHeader } from './_components/costs-header'
import { CostsMetricContextProvider } from './_components/costs-metric-context'
import { CostsTimeRangeContextProvider } from './_components/costs-time-range-context'
import { CostsUnitContextProvider } from './_components/costs-unit-context'
import { ScalingCostsTabs } from './_components/scaling-costs-tabs'

interface Props {
  entries: TabbedScalingEntries<ScalingCostsEntry>
  milestones: Milestone[]
}

export function ScalingCostsPage({ entries, milestones }: Props) {
  return (
    <>
      <TableFilterContextProvider>
        <CostsTimeRangeContextProvider>
          <CostsUnitContextProvider>
            <CostsMetricContextProvider>
              <CostsHeader />
              <ScalingCostsTabs {...entries} milestones={milestones} />
            </CostsMetricContextProvider>
          </CostsUnitContextProvider>
        </CostsTimeRangeContextProvider>
      </TableFilterContextProvider>
    </>
  )
}
