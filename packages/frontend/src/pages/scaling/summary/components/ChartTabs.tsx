import * as Tabs from '@radix-ui/react-tabs'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/ScalingSummaryActivityChart'
import { ScalingSummaryTvsChart } from '~/components/chart/tvs/ScalingSummaryTvsChart'
import type { ChartUnit } from '~/components/chart/types'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { cn } from '~/utils/cn'
import type { TimeRange } from '~/utils/range/range'

interface Props {
  unit: ChartUnit
  timeRange: ActivityTimeRange & TimeRange
  className?: string
}

export function ChartTabs({ unit, timeRange, className }: Props) {
  return (
    <PrimaryCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvs">
        <Tabs.Content value="tvs">
          <ScalingSummaryTvsChart unit={unit} timeRange={timeRange} />
        </Tabs.Content>
        <Tabs.Content value="activity">
          <ScalingSummaryActivityChart timeRange={timeRange} />
        </Tabs.Content>
        <Tabs.List className="flex gap-1.5">
          <Tabs.Trigger value="tvs" className="group w-full py-2.5">
            <div className="my-auto h-2 w-full rounded-full bg-surface-tertiary group-data-[state=active]:bg-brand" />
          </Tabs.Trigger>
          <Tabs.Trigger value="activity" className="group w-full py-2.5">
            <div className="my-auto h-2 w-full rounded-full bg-surface-tertiary group-data-[state=active]:bg-brand" />
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </PrimaryCard>
  )
}
