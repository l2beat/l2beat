import type { Milestone } from '@l2beat/config'
import { formatActivityCount } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { useIsClient } from '~/hooks/useIsClient'
import { InfoIcon } from '~/icons/Info'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { useActivityChartRangeContext } from '~/pages/layer2s/activity/components/ActivityChartRangeContext'
import { ActivityChartRangeControls } from '~/pages/layer2s/activity/components/ActivityChartRangeControls'
import { useActivityMetricContext } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import { CompareProjectsLink } from '~/pages/layer2s/compare/components/CompareProjectsLink'
import { getCompareEntryUrl } from '~/pages/layer2s/compare/utils/getCompareEntryUrl'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { ChartScale } from '../types'
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

  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.activity.recategorisedChart,
    {
      range,
      filter: {
        type: 'projects',
        projectIds: entries.map((entry) => entry.id),
      },
      hourly: true,
    },
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
      <Header resolution={data?.resolution ?? 'day'} entries={entries} />
      <L2RecategorizedActivityStats entries={entries} />
      <div className="mt-1 mb-2 flex items-center gap-2">
        <ChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        {data && <IncompleteHoursHint data={data} />}
      </div>
      <L2RecategorizedActivityChart
        isPlaceholderData={isPlaceholderData}
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
      <div className="mt-3 mb-2">
        <ActivityRatioChart
          isPlaceholderData={isPlaceholderData}
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

function Header({
  resolution,
  entries,
}: {
  resolution: ActivityResolution
  entries: L2ActivityEntry[]
}) {
  const trpc = useTRPC()
  const { metric, setMetric } = useActivityMetricContext()
  // The same query, with the same input, as the stat tiles under the head
  // (L2RecategorizedActivityStats), so both read one cached response.
  const { data: stats, isLoading } = useQuery(
    trpc.activity.chartStats.queryOptions({
      filter: {
        type: 'projects',
        projectIds: entries.map((entry) => entry.id),
      },
    }),
  )
  const pastDay = stats?.[metric]

  return (
    <ChartCardHeader
      title="Activity"
      subtitle={resolution === 'hour' ? 'Hourly average' : 'Daily average'}
      accessory={
        <>
          <ActivityMetricControls value={metric} onValueChange={setMetric} />
          <SwitchInfoTooltip />
        </>
      }
      value={
        pastDay !== undefined
          ? formatActivityCount(
              pastDay.rollups + pastDay.validiumsAndOptimiums + pastDay.others,
            )
          : undefined
      }
      unit={metric === 'uops' ? 'UOPS' : 'TPS'}
      valueLabel="past day"
      isLoading={isLoading}
    />
  )
}

function SwitchInfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger aria-label="About UOPS and TPS">
        <InfoIcon className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>
        User Operations Per Second (UOPS) takes into account the user
        operations, including regular transactions and actions bundled into a
        single transaction. Transactions Per Second (TPS) takes into account the
        regular transactions only.
      </TooltipContent>
    </Tooltip>
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

function IncompleteHoursHint({
  data,
}: {
  data: Pick<RecategorisedActivityChartData, 'withoutHours' | 'behind'>
}) {
  if (data.withoutHours.length === 0 && data.behind.length === 0) return null
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1 font-medium text-secondary text-xs lg:text-sm">
        <RoundedWarningIcon className="size-3.5" sentiment="warning" />
        Incomplete data
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-1">
        {data.withoutHours.length > 0 && (
          <p>
            Leaves out {formatList(data.withoutHours)}, which{' '}
            {data.withoutHours.length === 1 ? 'reports' : 'report'} activity per
            day only.
          </p>
        )}
        {data.behind.map(({ name, syncedUntil }) => (
          <p key={name}>
            Leaves out {name}, which has no data since{' '}
            {formatTimestamp(syncedUntil, { mode: 'datetime' })}.
          </p>
        ))}
      </TooltipContent>
    </Tooltip>
  )
}

function formatList(items: string[]) {
  return new Intl.ListFormat('en', { type: 'conjunction' }).format(items)
}
