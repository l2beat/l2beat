import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useActivityTimeRangeContext } from '~/pages/scaling/activity/components/ActivityTimeRangeContext'
import { ActivityTimeRangeControls } from '~/pages/scaling/activity/components/ActivityTimeRangeControls'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import type { ChartScale } from '../types'
import { ActivityChartHeader } from './ActivityChartHeader'
import { ActivityRatioChart } from './ActivityRatioChart'
import {
  RECATEGORISED_ACTIVITY_CHART_META,
  ScalingRecategorizedActivityChart,
} from './ScalingRecategorizedActivityChart'
import { ScalingRecategorizedActivityStats } from './ScalingRecategorizedActivityStats'
import { getRatioChartData } from './utils/getRatioChartData'

interface Props {
  milestones: Milestone[]
  entries: ScalingActivityEntry[]
}

export function ScalingActivityChart({ milestones, entries }: Props) {
  const { timeRange, setTimeRange } = useActivityTimeRangeContext()
  const [scale, setScale] = useLocalStorage<ChartScale>(
    'scaling-activity-scale',
    'lin',
  )
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    RECATEGORISED_ACTIVITY_CHART_META,
  )

  const { data, isLoading } = api.activity.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'projects', projectIds: entries.map((entry) => entry.id) },
  })

  const ratioData = useMemo(() => getRatioChartData(data), [data])
  const chartRange = useMemo(
    () => getChartRange(data?.data.map(([timestamp, ..._]) => ({ timestamp }))),
    [data?.data],
  )

  return (
    <div className="flex flex-col">
      <ActivityChartHeader />
      <ScalingRecategorizedActivityStats entries={entries} />
      <div className="mt-1 mb-2">
        <ChartTimeRange range={chartRange} />
      </div>
      <ScalingRecategorizedActivityChart
        data={data}
        isLoading={isLoading}
        milestones={milestones}
        chartMeta={RECATEGORISED_ACTIVITY_CHART_META}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
        }}
      />
      <ActivityRatioChart
        data={ratioData}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        className="mb-2"
      />
      <Controls
        scale={scale}
        setScale={setScale}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </div>
  )
}

interface ControlsProps {
  scale: ChartScale
  setScale: (scale: ChartScale) => void
  timeRange: ActivityTimeRange
  setTimeRange: (timeRange: ActivityTimeRange) => void
}

function Controls({ scale, setScale, timeRange, setTimeRange }: ControlsProps) {
  const isClient = useIsClient()
  return (
    <ChartControlsWrapper>
      <div className="flex gap-1">
        {isClient ? (
          <RadioGroup
            name="activityChartScale"
            value={scale}
            onValueChange={(value) => setScale(value as ChartScale)}
          >
            <RadioGroupItem value="log">LOG</RadioGroupItem>
            <RadioGroupItem value="lin">LIN</RadioGroupItem>
          </RadioGroup>
        ) : (
          <Skeleton className="h-8 w-[91px] md:w-[95px]" />
        )}
      </div>
      <ActivityTimeRangeControls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </ChartControlsWrapper>
  )
}
