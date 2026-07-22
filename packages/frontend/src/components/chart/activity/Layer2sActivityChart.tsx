import type { Milestone } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { useActivityChartRangeContext } from '~/pages/layer2s/activity/components/ActivityChartRangeContext'
import { ActivityChartRangeControls } from '~/pages/layer2s/activity/components/ActivityChartRangeControls'
import type { Layer2sActivityEntry } from '~/server/features/layer2s/activity/getLayer2sActivityEntries'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import type { ChartScale } from '../types'
import { ActivityChartHeader } from './ActivityChartHeader'
import { ActivityRatioChart } from './ActivityRatioChart'
import {
  Layer2sRecategorizedActivityChart,
  RECATEGORISED_ACTIVITY_CHART_META,
} from './Layer2sRecategorizedActivityChart'
import { Layer2sRecategorizedActivityStats } from './Layer2sRecategorizedActivityStats'
import { getRatioChartData } from './utils/getRatioChartData'

interface Props {
  milestones: Milestone[]
  entries: Layer2sActivityEntry[]
}

export function Layer2sActivityChart({ milestones, entries }: Props) {
  const trpc = useTRPC()
  const { range, setRange } = useActivityChartRangeContext()
  const [scale, setScale] = useState<ChartScale>('linear')
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    RECATEGORISED_ACTIVITY_CHART_META,
  )

  const { data, isLoading } = useQuery(
    trpc.activity.recategorisedChart.queryOptions({
      range,
      filter: {
        type: 'projects',
        projectIds: entries.map((entry) => entry.id),
      },
    }),
  )

  const ratioData = useMemo(() => getRatioChartData(data), [data])
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.data.map(([timestamp, ..._]) => ({ timestamp })),
        { bucket: 'day' },
      ),
    [data?.data],
  )

  return (
    <div className="flex flex-col">
      <ActivityChartHeader />
      <Layer2sRecategorizedActivityStats entries={entries} />
      <div className="mt-1 mb-2">
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <Layer2sRecategorizedActivityChart
        data={data}
        isLoading={isLoading}
        milestones={milestones}
        scale={scale}
        chartMeta={RECATEGORISED_ACTIVITY_CHART_META}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
        }}
      />
      <div className="mb-2">
        <ActivityRatioChart
          data={ratioData}
          isLoading={isLoading}
          syncedUntil={data?.syncedUntil}
        />
      </div>
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
