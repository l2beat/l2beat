import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Area, AreaChart, ReferenceLine } from 'recharts'
import { TvsCustomTooltip } from '~/components/chart/tvs/TvsChart'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import { ChartContainer, ChartTooltip } from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { OSSIFICATION_VALUE_LABELS } from '~/components/ossification/ossificationValueLabels'
import type { AuditsProjectTimeline } from '~/server/features/audits/types'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import {
  AuditMarker,
  AuditsTimelineMarkers,
  ChangeMarker,
  getBuckets,
} from './AuditsTimelineMarkers'

interface Props {
  project: ChartProject
  timeline: AuditsProjectTimeline
}

interface DataPoint {
  timestamp: number
  value: number | null
}

/**
 * The value secured over time with the project's audits and critical
 * upgrades marked on it. Projects without a value series keep the markers on
 * an empty time axis.
 */
export function AuditsProjectTimelineChart({ project, timeline }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(() => optionToRange('1y'))
  // MAX reaches back to the earliest marker.
  const from = range[0] ?? timeline.from
  const to = range[1]

  const { data, isLoading } = useQuery(
    trpc.audits.valueSeries.queryOptions({
      projectId: project.id,
      from,
      to,
    }),
  )

  const chartData: DataPoint[] | undefined = useMemo(() => {
    if (data === undefined) return undefined
    if (data === null) return getEmptyGrid(from, to)
    return data.points.map(([timestamp, value]) => ({ timestamp, value }))
  }, [data, from, to])

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )
  const markedTimestamps = useMemo(
    () =>
      getBuckets(chartData, timeline)
        .filter((b) => b.audits.length > 0 || b.changes.length > 0)
        .map((b) => ({
          timestamp: b.timestamp,
          isAudit: b.audits.length > 0,
        })),
    [chartData, timeline],
  )

  const label = OSSIFICATION_VALUE_LABELS[timeline.valueSource ?? 'tvs'].short
  const chartMeta = {
    value: {
      color: 'var(--chart-pink)',
      indicatorType: { shape: 'line' },
      label,
    },
  } satisfies ChartMeta

  return (
    <div className="flex flex-col gap-4">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <ChartRangeControls
          name="audits"
          value={range}
          setValue={setRange}
          options={[
            { value: '1y', label: '1Y' },
            { value: 'max', label: 'MAX' },
          ]}
        />
      </ChartControlsWrapper>
      <ChartContainer
        project={project}
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
      >
        <AreaChart responsive data={chartData} margin={{ top: 20 }}>
          <defs>
            <PinkFillGradientDef id="fill" />
            <PinkStrokeGradientDef id="stroke" />
          </defs>
          <Area
            dataKey="value"
            fill="url(#fill)"
            fillOpacity={1}
            stroke="url(#stroke)"
            isAnimationActive={false}
          />
          {markedTimestamps.map(({ timestamp, isAudit }) => (
            <ReferenceLine
              key={timestamp}
              x={timestamp}
              stroke={isAudit ? 'var(--brand)' : 'var(--primary)'}
              strokeOpacity={0.5}
              strokeDasharray="3 3"
            />
          ))}
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={{
              tickFormatter: (value: number) => formatCurrency(value, 'usd'),
              tickCount: 4,
            }}
            syncedUntil={data?.syncedUntil}
          />
          <ChartTooltip
            filterNull={false}
            content={<TvsCustomTooltip unit="usd" />}
          />
        </AreaChart>
      </ChartContainer>
      <AuditsTimelineMarkers data={chartData} timeline={timeline} />
      <Legend hasOssification={timeline.hasOssification} />
    </div>
  )
}

function Legend({ hasOssification }: { hasOssification: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-secondary text-xs">
      <span className="flex items-center gap-1.5">
        <AuditMarker audits={[{ matched: true }]} className="size-3" />
        Audit report matching deployed code
      </span>
      <span className="flex items-center gap-1.5">
        <AuditMarker audits={[{ matched: false }]} className="size-3" />
        Audit report without a match
      </span>
      {hasOssification ? (
        <span className="flex items-center gap-1.5">
          <ChangeMarker changes={[]} className="size-2.5" />
          Critical upgrade
        </span>
      ) : (
        <span>Critical upgrades are not tracked for this project.</span>
      )}
    </div>
  )
}

/** A daily axis for projects without a value series. */
function getEmptyGrid(from: number, to: number): DataPoint[] {
  const start = UnixTime.toStartOf(UnixTime(from), 'day')
  const points: DataPoint[] = []
  for (let t = start; t <= to; t += UnixTime.DAY) {
    points.push({ timestamp: t, value: null })
  }
  return points
}
