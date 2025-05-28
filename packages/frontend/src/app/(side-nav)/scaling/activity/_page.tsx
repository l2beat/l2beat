import type { Milestone } from '@l2beat/config'
import type { ScalingActivityEntry } from 'rewrite/src/server/features/scaling/activity/get-scaling-activity-entries'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { ActivityMetricContextProvider } from './_components/activity-metric-context'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTabs } from './_components/scaling-activity-tabs'

interface Props {
  entries: TabbedScalingEntries<ScalingActivityEntry>
  milestones: Milestone[]
}

export function ActivityPage({ entries, milestones }: Props) {
  return (
    <TableFilterContextProvider>
      <ActivityTimeRangeContextProvider>
        <ActivityMetricContextProvider>
          <MainPageHeader>Activity</MainPageHeader>
          <ScalingActivityTabs {...entries} milestones={milestones} />
        </ActivityMetricContextProvider>
      </ActivityTimeRangeContextProvider>
    </TableFilterContextProvider>
  )
}
