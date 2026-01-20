import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { useActivityChartRangeContext } from '~/pages/scaling/activity/components/ActivityChartRangeContext'
import { ActivityChartRangeControls } from '~/pages/scaling/activity/components/ActivityChartRangeControls'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
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
  const { range, setRange } = useActivityChartRangeContext()
  const [scale, setScale] = useState<ChartScale>('linear')
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    RECATEGORISED_ACTIVITY_CHART_META,
  )

  const { data, isLoading } = api.activity.recategorisedChart.useQuery({
    range,
    filter: { type: 'projects', projectIds: entries.map((entry) => entry.id) },
  })

  const ratioData = useMemo(() => getRatioChartData(data), [data])
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.data.map(([timestamp, ..._]) => ({ timestamp })),
      ),
    [data?.data],
  )

  return (
    <div className="flex flex-col">
      <ActivityChartHeader />
      <ScalingRecategorizedActivityStats entries={entries} />
      <div className="mt-1 mb-2">
        <ChartTimeRange timeRange={timeRange} />
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
        range={range}
        setRange={setRange}
      />
    </div>
  )
}

interface ControlsProps {
  scale: ChartScale
  setScale: (scale: ChartScale) => void
  range: ChartRange
  setRange: (range: ChartRange) => void
}

function Controls({ scale, setScale, range, setRange }: ControlsProps) {
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
            <RadioGroupItem value="symlog">LOG</RadioGroupItem>
            <RadioGroupItem value="linear">LIN</RadioGroupItem>
          </RadioGroup>
        ) : (
          <Skeleton className="h-8 w-[91px] md:w-[95px]" />
        )}
      </div>
      <ActivityChartRangeControls range={range} setRange={setRange} />
    </ChartControlsWrapper>
  )
}
