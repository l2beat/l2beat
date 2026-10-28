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
import { CompareProjectsLink } from '~/pages/layer2s/compare/components/CompareProjectsLink'
import { getCompareEntryUrl } from '~/pages/layer2s/compare/utils/getCompareEntryUrl'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { ChartScale } from '../types'
import { ActivityChartHeader } from './ActivityChartHeader'
import { ActivityRatioChart } from './ActivityRatioChart'
import {
  L2RecategorizedActivityChart,
  RECATEGORISED_ACTIVITY_CHART_META,
} from './L2RecategorizedActivityChart'
import { L2RecategorizedActivityStats } from './L2RecategorizedActivityStats'
import { getRatioChartData } from './utils/getRatioChartData'

interface Props {
  milestones: Milestone[]
  entries: L2ActivityEntry[]
}

export function L2ActivityChart({ milestones, entries }: Props) {
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
      hourly: true,
    }),
  )

  const ratioData = useMemo(() => getRatioChartData(data), [data])
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.data.map(([timestamp, ..._]) => ({ timestamp })),
        { bucket: data?.resolution ?? 'day' },
      ),
    [data?.data, data?.resolution],
  )

  return (
    <div className="flex flex-col">
      <ActivityChartHeader resolution={data?.resolution ?? 'day'} />
      <L2RecategorizedActivityStats entries={entries} />
      <div className="mt-1 mb-2">
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <L2RecategorizedActivityChart
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
      {data && data.withoutHours.length > 0 && (
        <p className="mt-1 mb-3 text-center font-medium text-secondary text-xs">
          Hourly data leaves out {formatList(data.withoutHours)}, which report
          activity per day only.
        </p>
      )}
      {data?.behind.map(({ name, syncedUntil }) => (
        <p
          key={name}
          className="mt-1 mb-3 text-center font-medium text-secondary text-xs"
        >
          Hourly data leaves out {name}, which has no data since{' '}
          {formatTimestamp(syncedUntil, { mode: 'datetime' })}.
        </p>
      ))}
      <div className="mb-2">
        <ActivityRatioChart
          data={ratioData}
          isLoading={isLoading}
          syncedUntil={data?.syncedUntil}
          resolution={data?.resolution}
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
      <div className="flex flex-wrap items-center gap-2">
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
        <CompareProjectsLink
          href={getCompareEntryUrl({ metric: 'activity' })}
        />
      </div>
      <ActivityChartRangeControls
        range={range}
        setRange={setRange}
        hourlyRanges="enabled"
      />
    </ChartControlsWrapper>
  )
}

function formatList(items: string[]) {
  return new Intl.ListFormat('en', { type: 'conjunction' }).format(items)
}
