'use client'
import * as Tabs from '@radix-ui/react-tabs'
import { SummaryActivityChart } from '~/components/chart/activity/summary-activity-chart'
import { ScalingTvlChart } from '~/components/chart/tvl/scaling-tvl-chart'
import { type ChartUnit } from '~/components/chart/types'
import { MainPageCard } from '~/components/main-page-card'
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
    <MainPageCard className={cn(className, 'pb-1')}>
      <Tabs.Root defaultValue="tvl">
        <Tabs.Content value="tvl">
          <ScalingTvlChart unit={unit} timeRange={timeRange} />
        </Tabs.Content>
        <Tabs.Content value="activity">
          <SummaryActivityChart timeRange={timeRange} />
        </Tabs.Content>
        <Tabs.List className="flex gap-1.5">
          <Tabs.Trigger value="tvl" className="group w-full py-3">
            <div className="my-auto h-1 w-full rounded-full bg-[#CCD0DA] group-data-[state=active]:bg-pink-900 dark:group-data-[state=active]:bg-pink-200" />
          </Tabs.Trigger>
          <Tabs.Trigger value="activity" className="group w-full py-3">
            <div className="my-auto h-1 w-full rounded-full bg-[#CCD0DA] group-data-[state=active]:bg-pink-900 dark:group-data-[state=active]:bg-pink-200" />
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </MainPageCard>
  )
}
