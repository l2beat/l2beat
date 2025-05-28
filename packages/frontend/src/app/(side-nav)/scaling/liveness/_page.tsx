import type { ScalingLivenessEntry } from 'rewrite/src/server/features/scaling/liveness/get-scaling-liveness-entries'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { LivenessHeader } from './_components/liveness-header'
import { LivenessTimeRangeContextProvider } from './_components/liveness-time-range-context'
import { ScalingLivenessTables } from './_components/scaling-liveness-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingLivenessEntry>
}

export function ScalingLivenessPage({ entries }: Props) {
  return (
    <>
      <LivenessTimeRangeContextProvider>
        <LivenessHeader />
        <TableFilterContextProvider>
          <ScalingLivenessTables {...entries} />
        </TableFilterContextProvider>
      </LivenessTimeRangeContextProvider>
    </>
  )
}
