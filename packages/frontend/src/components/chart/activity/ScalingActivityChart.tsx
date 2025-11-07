import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
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
import { ScalingRecategorizedActivityChart } from './ScalingRecategorizedActivityChart'
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

  const { data, isLoading } = api.activity.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'projects', projectIds: entries.map((entry) => entry.id) },
  })

  const ratioData = useMemo(() => getRatioChartData(data), [data])

  return (
    <div className="flex flex-col">
      <ActivityChartHeader />
      <ScalingRecategorizedActivityStats entries={entries} />
      <ScalingRecategorizedActivityChart data={data} isLoading={isLoading} />
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
