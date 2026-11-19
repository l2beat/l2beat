import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { ActivityChartRangeControls } from '~/pages/layer2s/activity/components/ActivityChartRangeControls'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import type { ChartScale } from '../types'
import { ActivityChart } from './ActivityChart'
import { ActivityChartStatsPanel } from './ActivityChartStatsPanel'
import { ActivityRatioChart } from './ActivityRatioChart'
import {
  type ActivityChartCounts,
  useActivityChartPoints,
} from './useActivityChartPoints'
import { getChartType } from './utils/getChartType'

interface Props {
  milestones: Milestone[]
  project: ChartProject
  category?: ProjectScalingCategory
  defaultRange: ChartRange
}

export function EthereumActivityChart({
  milestones,
  project,
  category,
  defaultRange,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('linear')

  const {
    data: chart,
    isLoading,
    isPlaceholderData,
  } = useChartQuery(trpc.activity.ethereumChart, { range })

  const type = getChartType(category)

  const { chartData, ratioData, timeRange, formatPeriod } =
    useActivityChartPoints(chart, toCounts, 'day', metric)
  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <ActivityChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <div className="mt-4 mb-3">
        <ActivityChart
          isPlaceholderData={isPlaceholderData}
          data={chartData}
          milestones={milestones}
          scale={scale}
          metric={metric}
          isLoading={isLoading}
          syncedUntil={chart?.syncedUntil}
          type={type}
          project={project}
          tickCount={4}
          liveUntil={chart?.liveUntil}
        />
      </div>
      <div className="mb-2">
        <ActivityRatioChart
          isPlaceholderData={isPlaceholderData}
          data={ratioData}
          syncedUntil={chart?.syncedUntil}
          formatPeriod={formatPeriod}
          isLoading={isLoading}
        />
      </div>

      <div className="flex justify-between gap-4">
        <ActivityMetricControls value={metric} onValueChange={setMetric} />
        <RadioGroup
          name="activityChartScale"
          value={scale}
          onValueChange={(value) => setScale(value as ChartScale)}
        >
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
          <RadioGroupItem value="symlog">LOG</RadioGroupItem>
        </RadioGroup>
      </div>
      <ActivityChartStatsPanel
        stats={chart?.stats}
        metric={metric}
        isLoading={isLoading}
      />
    </div>
  )
}

function toCounts([timestamp, tx, uops]: [
  number,
  number | null,
  number | null,
]): ActivityChartCounts {
  return { timestamp, ethereum: { tx, uops } }
}
