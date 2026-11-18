import type { ProjectScalingCategory } from '@l2beat/config'
import {
  formatActivityCount,
  formatInteger,
  formatNumber,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { getYAxisTicks } from '~/components/core/chart/utils/yAxisTicks'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  TooltipHeader,
  TooltipRow,
} from '~/components/core/tooltip/TooltipParts'
import { PercentChange } from '~/components/PercentChange'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { HOME_TEXT } from '~/pages/home/homeStyles'
import {
  DEFAULT_LIVE_RANGE,
  isLiveFresh,
  LIVE_BUCKET_SECONDS,
  LIVE_BUFFER_SECONDS,
  LIVE_RANGES,
  type LiveRange,
} from '~/server/features/layer2s/activity/live/liveRanges'
import { useTRPC } from '~/trpc/React'
import { formatRange, parseTimestamp } from '~/utils/dates'
import { typeToColor } from '../ActivityChart'
import { ActivityRatioChart } from '../ActivityRatioChart'
import { getChartType } from '../utils/getChartType'
import { glideCharts, placeHead } from './glideCharts'
import { LiveDot } from './LiveDot'
import { LiveOverview } from './LiveOverview'
import {
  getUsualRate,
  getWindowStats,
  type LiveMetric,
  toBuckets,
  toSteps,
  valueAt,
  withDashAnchor,
  withUsual,
} from './liveSteps'
import { LOOKAHEAD_DRAWINGS, useLivePlayhead } from './useLivePlayhead'

/** Seconds between the time ticks of each range */
const TICK_SECONDS: Record<LiveRange, number> = {
  '5m': 60,
  '15m': 3 * 60,
  '1h': 15 * 60,
  '4h': 60 * 60,
}
const formatBlocks = (value: number) => formatNumber(value, 1)
const formatGas = (value: number) => formatNumber(value, 1)
const formatGasTick = (value: number) => formatNumber(value, 0)
/**
 * The chart's own, kept here to place the head on its plot, but with none on
 * the right: what slides in is cut at the edge, so a step shows only once the
 * head reaches it
 */
const CHART_MARGIN = { top: 20, right: 0, bottom: 25, left: 0 }

/**
 * The chain's blocks of the last hours, laid out as the history: a window of
 * them, following the newest block until looked back, with the whole buffer
 * below to pick it from
 */
export function ProjectLiveActivity({
  project,
  category,
  metric,
  setMetric,
  to,
  setTo,
  onAvailable,
}: {
  project: ChartProject
  category: ProjectScalingCategory | undefined
  metric: LiveMetric
  setMetric: (metric: LiveMetric) => void
  /** Where the window ends, undefined while following the newest block */
  to: number | undefined
  setTo: (to: number | undefined) => void
  /** Told whether the chain's blocks are stored as they come */
  onAvailable: (available: boolean) => void
}) {
  const trpc = useTRPC()
  const [range, setRange] = useState<LiveRange>(DEFAULT_LIVE_RANGE)
  // while the window is moved on the overview, before it is read
  const [seeking, setSeeking] = useState(false)
  const query = useQuery({
    ...trpc.activity.liveProject.queryOptions({
      projectId: project.id,
      range,
      to,
    }),
    placeholderData: keepPreviousData,
    refetchInterval: (to === undefined ? 5 : 30) * 1000,
  })
  const { isLoading, isPlaceholderData } = query
  // tooltips read where buckets are drawn, so while the charts are hovered the
  // window holds still on the data it was drawn from, whatever is read since
  const [held, setHeld] = useState<{
    data: typeof query.data
    dataUpdatedAt: number
    range: LiveRange
    to: number | undefined
  }>()
  // a snapshot belongs to the window it was taken for, as the range or end
  // can change from the keyboard with the pointer still over the charts
  const holding = held?.range === range && held.to === to
  const { data, dataUpdatedAt } = holding ? held : query
  const live = to === undefined
  // only once this window's data is read, as the pointer can come in before,
  // and then also with the pointer still
  const hovered = useRef(false)
  const hold = () => {
    if (!hovered.current || holding || !query.data || isPlaceholderData) return
    setHeld({
      data: query.data,
      dataUpdatedAt: query.dataUpdatedAt,
      range,
      to,
    })
  }
  useEffect(() => hold())

  // following the newest block, the window scrolls with the clock: drawn
  // every 1/300 of it, about 2.5 pixels, and slid along in between
  const charts = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const redrawEvery = LIVE_RANGES[range] / 300
  const playhead = useLivePlayhead(
    live && data?.newest !== undefined ? data.detail.to + 1 : undefined,
    dataUpdatedAt,
    redrawEvery,
    // the head reads the layout, so before the charts slide
    (seconds) => {
      placeHead(
        head.current,
        charts.current,
        rows && playhead !== undefined
          ? valueAt(rows, playhead + seconds)
          : null,
        top,
        CHART_MARGIN,
      )
      glideCharts(charts.current, seconds, LIVE_RANGES[range])
    },
    holding,
  )
  // drawn past the right edge too, for what slides in before the next drawing
  const lookahead =
    playhead === undefined ? 0 : LOOKAHEAD_DRAWINGS * redrawEvery
  const domain: [number, number] | undefined = data
    ? playhead !== undefined
      ? [playhead - LIVE_RANGES[range], playhead]
      : [data.detail.from, data.detail.to + 1]
    : undefined

  const buckets = useMemo(
    () => (data ? toBuckets(data.detail, metric, data.oldest) : undefined),
    [data, metric],
  )
  const bucket = data?.detail.bucket ?? 1
  const rows =
    buckets &&
    domain &&
    withUsual(
      withDashAnchor(
        toSteps(buckets, bucket, [domain[0], domain[1] + lookahead]),
        domain[0],
      ),
      data?.usual ?? [],
      metric,
    )
  const top = useSteadyTop(
    rows && rows.length > 0
      ? Math.max(
          ...rows.map((row) => Math.max(row.value ?? 0, row.usualMax ?? 0)),
        )
      : undefined,
  )
  const color =
    project.id === ProjectId.ETHEREUM
      ? 'var(--chart-ethereum)'
      : typeToColor(getChartType(category))
  const meta: ChartMeta = {
    value: {
      label: project.shortName ?? project.name,
      color,
      indicatorType: { shape: 'line' },
    },
  }
  const xAxis = domain && {
    ticks: ticksOf(domain[0], domain[1] + lookahead, range),
    format: formatTick,
    domain,
  }

  // without recent blocks the section goes back to the history
  const available = data && isLiveFresh(data.newest, UnixTime.now())
  useEffect(() => {
    if (available !== undefined) onAvailable(available)
  }, [available, onAvailable])

  if (!data && query.isError) {
    return (
      <p className="py-12 text-center text-secondary">
        Live activity can't be read right now.
      </p>
    )
  }

  const newest = data?.newest
  /** Within the buffer, and following the newest block once close to it */
  const clampTo = (end: number | undefined, range: LiveRange) => {
    if (end === undefined || newest === undefined) return undefined
    const clamped = Math.max(
      getBufferFrom(newest, data?.oldest, range) + LIVE_RANGES[range],
      end,
    )
    return clamped >= newest - LIVE_RANGES[range] / 20 ? undefined : clamped
  }

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          timeRange={domain}
          isPlaceholderData={isPlaceholderData}
        />
        <RadioGroup
          name="liveActivityRange"
          value={range}
          onValueChange={(value) => {
            setRange(value as LiveRange)
            setTo(clampTo(to, value as LiveRange))
          }}
        >
          {Object.keys(LIVE_RANGES).map((value) => (
            <RadioGroupItem key={value} value={value}>
              {value.toUpperCase()}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </ChartControlsWrapper>
      <div
        ref={charts}
        className="relative"
        onPointerEnter={() => {
          hovered.current = true
          hold()
        }}
        onPointerLeave={() => {
          hovered.current = false
          setHeld(undefined)
        }}
      >
        <div className="mt-4 mb-3">
          <ChartContainer
            data={rows}
            meta={meta}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData || seeking}
            project={project}
            legend
          >
            <TimeSeriesChart
              data={rows ?? []}
              series={[
                {
                  key: 'usual',
                  value: (row) => row.usualMax,
                  value0: (row) => row.usualMin,
                  fill: 'var(--secondary)',
                  fillOpacity: 0.15,
                  activeDot: false,
                },
                {
                  key: 'usualMedian',
                  value: (row) => row.usualMedian,
                  stroke: 'var(--secondary)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                  activeDot: false,
                },
                { key: 'value', ...tinted(color) },
              ]}
              ariaLabel="Live activity"
              xAxis={xAxis}
              yAxis={{
                ...(metric === 'gas'
                  ? { format: formatGasTick, unit: ' gas/s' }
                  : { unit: metric === 'tps' ? ' TPS' : ' UOPS' }),
                tickCount: 3,
                domain: top === undefined ? undefined : [0, top],
              }}
              margin={CHART_MARGIN}
              renderTooltip={(row) => (
                <LiveTooltip
                  row={row}
                  bucket={bucket}
                  metric={metric}
                  color={color}
                />
              )}
            />
          </ChartContainer>
        </div>
        {playhead !== undefined && !seeking && !isPlaceholderData && (
          <div
            ref={head}
            className="pointer-events-none invisible absolute top-0 left-0"
          >
            <LiveDot
              color={color}
              className="-translate-x-1/2 -translate-y-1/2"
            />
          </div>
        )}
        {metric !== 'gas' && (
          <div className="mb-2">
            <ActivityRatioChart
              data={rows}
              isLoading={isLoading}
              isPlaceholderData={isPlaceholderData || seeking}
              syncedUntil={undefined}
              xAxis={xAxis}
              formatPeriod={(timestamp) => formatBucket(timestamp, bucket)}
            />
          </div>
        )}
      </div>
      {newest !== undefined && data && domain && (
        <div className="mb-4 flex flex-col gap-1">
          <span className={HOME_TEXT.meta}>
            {data.oldest !== undefined && isFilling(newest, data.oldest)
              ? `Since ${formatTick(data.oldest)}`
              : 'Last 4 hours'}
            , a bar a minute. Press or drag to look back
          </span>
          <LiveOverview
            points={data.overview}
            from={getBufferFrom(newest, data.oldest, range)}
            to={newest}
            // looking back, where it was asked to end, before that is read
            window={to === undefined ? domain : [to - LIVE_RANGES[range], to]}
            windowText={
              live
                ? 'Live'
                : formatRange(domain[0], domain[1], { seconds: true })
            }
            metric={metric}
            // on a bucket, so moves within one share a read
            onMove={(end) =>
              setTo(clampTo(end - (end % LIVE_BUCKET_SECONDS[range]), range))
            }
            onSeeking={setSeeking}
          />
        </div>
      )}
      <RadioGroup
        name="liveActivityMetric"
        value={metric}
        onValueChange={(value) => setMetric(value as LiveMetric)}
        variant="highlighted"
        className="self-start"
      >
        {(['uops', 'tps', 'gas'] as const).map((value) => (
          <RadioGroupItem
            key={value}
            value={value}
            className="h-full px-[6px] text-sm uppercase"
          >
            {value}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <LiveStats
        usual={
          metric !== 'gas' && data && domain
            ? getUsualRate(data.usual, metric, domain)
            : undefined
        }
        metric={metric}
        stats={buckets && domain && getWindowStats(buckets, bucket, domain)}
        window={live ? range : domain}
        isLoading={isLoading}
      />
    </div>
  )
}

/** How each range reads after "last" */
const RANGE_LABEL: Record<LiveRange, string> = {
  '5m': '5 min',
  '15m': '15 min',
  '1h': 'hour',
  '4h': '4 hours',
}

/** The window on screen in figures, against the same hour over the past week */
function LiveStats({
  usual,
  metric,
  stats,
  window,
  isLoading,
}: {
  /** Per second, over the window, on the days of the past week */
  usual: number | undefined
  metric: LiveMetric
  stats: ReturnType<typeof getWindowStats>
  /** The range following the newest block, or the window looked back to */
  window: LiveRange | [number, number] | undefined
  isLoading: boolean
}) {
  const span =
    typeof window === 'string'
      ? `last ${RANGE_LABEL[window]}`
      : window
        ? formatRange(window[0], window[1])
        : ''
  const blocks = (
    <ChartStatsItem label="Blocks per minute" isLoading={isLoading}>
      {stats && (
        <RollingNumber value={stats.blocksPerMinute} format={formatBlocks} />
      )}
    </ChartStatsItem>
  )

  if (metric === 'gas') {
    return (
      <ChartStats className={STATS_CLASS}>
        <ChartStatsItem
          label={`Gas per second, ${span}`}
          tooltip="Gas used per second over the window shown."
          isLoading={isLoading}
        >
          {stats && <RollingNumber value={stats.rate} format={formatGas} />}
        </ChartStatsItem>
        {blocks}
        <ChartStatsItem label="Gas per block" isLoading={isLoading}>
          {stats && stats.blocksPerMinute > 0 && (
            <RollingNumber
              value={(stats.gasPerSecond * 60) / stats.blocksPerMinute}
              format={formatGas}
            />
          )}
        </ChartStatsItem>
      </ChartStats>
    )
  }

  return (
    <ChartStats className={STATS_CLASS}>
      <ChartStatsItem
        label={`${metric === 'uops' ? 'UOPS' : 'TPS'}, ${span}`}
        tooltip={`${metric === 'uops' ? 'User operations' : 'Transactions'} per second over the window shown, with a percentage change compared to the median of the same hours on the days of the past week.`}
        isLoading={isLoading}
      >
        {stats && (
          <ValueWithPercentageChange
            change={
              usual !== undefined && usual > 0
                ? stats.rate / usual - 1
                : undefined
            }
            changePeriod="7D"
            className="text-sm xs:text-lg md:text-lg"
            changeClassName="text-xs"
          >
            <RollingNumber value={stats.rate} format={formatActivityCount} />
          </ValueWithPercentageChange>
        )}
      </ChartStatsItem>
      {blocks}
      <ChartStatsItem label="Gas per second" isLoading={isLoading}>
        {stats && (
          <RollingNumber value={stats.gasPerSecond} format={formatGas} />
        )}
      </ChartStatsItem>
    </ChartStats>
  )
}

const STATS_CLASS = 'mt-4 max-md:gap-y-2.5 md:grid-cols-3 lg:grid-cols-3'

/**
 * Laid out as the history's: the bucket's rate, with the past week's at this
 * hour under it, then the total it comes from
 */
function LiveTooltip({
  row,
  bucket,
  metric,
  color,
}: {
  row: {
    timestamp: number
    value: number | null
    blocks: number
    usualMin: number | null
    usualMedian: number | null
    usualMax: number | null
  }
  bucket: number
  metric: LiveMetric
  color: string
}) {
  const { value, blocks, usualMin, usualMedian, usualMax } = row
  const format = metric === 'gas' ? formatGas : formatRate
  return (
    <ChartTooltipWrapper>
      <div className="flex w-48 flex-col sm:w-64">
        <ChartTooltipTitle className="mb-3 whitespace-nowrap">
          {formatBucket(row.timestamp, bucket)}
        </ChartTooltipTitle>
        {value === null ? (
          <span className="text-secondary">No blocks stored yet</span>
        ) : (
          <>
            <TooltipHeader label={RATE_LABEL[metric]} />
            <div className="mt-2 flex flex-col gap-2">
              <ChartTooltipRow name="value">
                <span className="flex items-baseline gap-1">
                  <ChartTooltipValue
                    value={value}
                    format={format}
                    className="tabular-nums"
                  />
                  {usualMedian !== null && usualMedian > 0 && (
                    <PercentChange
                      value={value / usualMedian - 1}
                      className="min-w-0"
                    />
                  )}
                </span>
              </ChartTooltipRow>
              {usualMin !== null &&
                usualMedian !== null &&
                usualMax !== null && (
                  <>
                    <TooltipRow
                      indicator={
                        <ChartDataIndicator
                          type={{ shape: 'line', strokeDasharray: '3 3' }}
                          backgroundColor="var(--secondary)"
                        />
                      }
                      label="Usual at this hour"
                      labelClassName="w-20 sm:w-fit"
                    >
                      <span className="flex items-baseline gap-1">
                        <ChartTooltipValue
                          value={usualMedian}
                          format={format}
                          className="tabular-nums"
                        />
                        <span className={SECONDARY_VALUE}>
                          ({format(usualMin)}–{format(usualMax)})
                        </span>
                      </span>
                    </TooltipRow>
                    <UsualBar
                      value={value}
                      min={usualMin}
                      median={usualMedian}
                      max={usualMax}
                      color={color}
                    />
                  </>
                )}
            </div>
            <TooltipHeader className="mt-3" label={TOTAL_LABEL[metric]} />
            <div className="mt-2 flex flex-col gap-2">
              <ChartTooltipRow name="value">
                <span className="flex items-baseline gap-1">
                  <ChartTooltipValue
                    value={value * bucket}
                    format={(total) =>
                      metric === 'gas'
                        ? formatGas(total)
                        : formatInteger(Math.round(total))
                    }
                    className="tabular-nums"
                  />
                  <span className={SECONDARY_VALUE}>
                    ({formatInteger(blocks)} {blocks === 1 ? 'block' : 'blocks'}
                    )
                  </span>
                </span>
              </ChartTooltipRow>
            </div>
          </>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}

const RATE_LABEL: Record<LiveMetric, string> = {
  uops: 'UOPS',
  tps: 'TPS',
  gas: 'Gas per second',
}
const TOTAL_LABEL: Record<LiveMetric, string> = {
  uops: 'Operations count',
  tps: 'Transactions count',
  gas: 'Gas used',
}
/** As stacked charts' tooltips put a share after a value */
const SECONDARY_VALUE =
  'whitespace-nowrap font-medium text-label-value-13 text-secondary tabular-nums sm:text-label-value-15'
const formatRate = (value: number) =>
  formatActivityCount(value, { decimals: value < 100 ? 1 : 0 })

/** The rate on the past week's range at this hour, low to high, with the median a tick on it */
function UsualBar({
  value,
  min,
  median,
  max,
  color,
}: {
  value: number
  min: number
  median: number
  max: number
  color: string
}) {
  const low = Math.min(min, value)
  const high = Math.max(max, value)
  const at = (v: number) =>
    `${high > low ? ((v - low) / (high - low)) * 100 : 50}%`
  return (
    <div className="relative mx-1 h-2" aria-hidden>
      <div
        className="-translate-y-1/2 absolute top-1/2 h-0.5 rounded-full bg-secondary/50"
        style={{ left: at(min), width: `calc(${at(max)} - ${at(min)})` }}
      />
      <div
        className="absolute inset-y-0 w-px bg-secondary"
        style={{ left: at(median) }}
      />
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-2 rounded-full"
        style={{ left: at(value), backgroundColor: color }}
      />
    </div>
  )
}

/**
 * Where the stored blocks start: the buffer's start, or while it fills, as
 * after a chain is first followed, its oldest block. On the minute, as the
 * overview's bars are, and at least a range back
 */
function getBufferFrom(
  newest: number,
  oldest: number | undefined,
  range: LiveRange,
) {
  const start = Math.max(newest - LIVE_BUFFER_SECONDS, oldest ?? newest)
  return Math.min(
    newest - LIVE_RANGES[range],
    start - (start % UnixTime.MINUTE),
  )
}

/** Holding clearly less than the buffer, which the cleaner trims to just under it */
function isFilling(newest: number, oldest: number) {
  return newest - oldest < LIVE_BUFFER_SECONDS - 15 * UnixTime.MINUTE
}

/** Buckets are counted from the epoch, so any time in one gives its start */
function formatBucket(timestamp: number, bucket: number) {
  const start = Math.floor(timestamp / bucket) * bucket
  return formatRange(start, start + bucket, { seconds: true })
}

/**
 * Holds the axis' top while the values fit well under it, so the chart does
 * not rescale on every read
 */
function useSteadyTop(max: number | undefined) {
  const committed = useRef<number | undefined>(undefined)
  const held = committed.current
  const top =
    max !== undefined && (held === undefined || max > held || max < held * 0.4)
      ? getYAxisTicks([0, max], { tickCount: 3 }, 1).domain[1]
      : held
  useLayoutEffect(() => {
    committed.current = top
  })
  return top
}

function ticksOf(from: number, to: number, range: LiveRange) {
  const step = TICK_SECONDS[range]
  const ticks: number[] = []
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t)
  return ticks
}

function formatTick(timestamp: number) {
  return parseTimestamp(timestamp).time
}
