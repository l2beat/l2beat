'use client'
import * as Tabs from '@radix-ui/react-tabs'
import { ScalingSummaryActivityChart } from '~/components/chart/activity/scaling-summary-activity-chart'
import { ScalingSummaryTvlChart } from '~/components/chart/tvl/scaling-summary-tvl-chart'
import { type ChartUnit } from '~/components/chart/types'
import { PrimaryCard } from '~/components/primary-card'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { cn } from '~/utils/cn'
import { type TimeRange } from '~/utils/range/range'

interface Props {
  unit: ChartUnit
  timeRange: ActivityTimeRange & TimeRange
  className?: string
}

export function ChartTabs({ unit, timeRange, className }: Props) {
  return (
    <PrimaryCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvl">
        <Tabs.Content value="tvl">
          <ScalingSummaryTvlChart unit={unit} timeRange={timeRange} />
        </Tabs.Content>
        <Tabs.Content value="activity">
          <ScalingSummaryActivityChart timeRange={timeRange} />
        </Tabs.Content>
        <Tabs.List className="flex gap-1.5">
          <Tabs.Trigger value="tvl" className="group w-full py-2.5">
            <div className="bg-surface-tertiary group-data-[state=active]:bg-brand my-auto h-2 w-full rounded-full" />
          </Tabs.Trigger>
          <Tabs.Trigger value="activity" className="group w-full py-2.5">
            <div className="bg-surface-tertiary group-data-[state=active]:bg-brand my-auto h-2 w-full rounded-full" />
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </PrimaryCard>
  )
}
