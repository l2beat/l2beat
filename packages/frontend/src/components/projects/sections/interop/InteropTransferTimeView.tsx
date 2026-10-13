import { formatSeconds, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getTickFormatter } from '~/components/core/chart/utils/getXAxisProps'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { SwapIcon } from '~/icons/Swap'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type {
  InteropTransferTimeAveragesData,
  InteropTransferTimeData,
  InteropTransferTimeRoute,
} from '~/server/features/layer2s/interop/getInteropTransferTime'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { type ChartRange, optionToRange } from '~/utils/range/range'

/** The page's own bridge keeps one colour on every route. */
const HIGHLIGHT_COLOR = 'var(--chart-emerald)'
const COLORS = [
  'var(--chart-sky)',
  'var(--chart-orange)',
  'var(--chart-yellow)',
  'var(--chart-fuchsia)',
  'var(--chart-cyan)',
  'var(--chart-pink)',
  'var(--chart-lime)',
  'var(--chart-stacked-purple)',
]
const CARRIED_COLOR = 'var(--secondary)'
/** Days with fewer transfers than this get a hollow point. */
const LOW_SAMPLE = 3
const LOG_TICKS = [1, 5, 10, 30, 60, 300, 900, 1800, 3600, 7200, 21600, 86400]
const AVERAGE_RANGE_OPTIONS = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '180d', label: '180D' },
  { value: 'max', label: 'MAX' },
] as const

type ChartPoint = { timestamp: number } & Record<string, number | null>

interface Route {
  from: string
  to: string
}

/** What both charts draw: one value per protocol per point in time. */
interface TimeSeriesData {
  timestamps: number[]
  series: {
    id: string
    label: string
    points: ({ value: number; count: number } | null)[]
  }[]
}
type Series = TimeSeriesData['series'][number]

interface Metric {
  /** "median" or "average", as written in the tooltip. */
  name: string
  formatTime: (timestamp: number, isLast: boolean) => string
}

const MEDIAN_METRIC: Metric = {
  name: 'median',
  formatTime: (timestamp, isLast) =>
    formatTimestamp(timestamp, { longMonthName: true }) +
    (isLast ? ' (in progress)' : ''),
}

const AVERAGE_METRIC: Metric = {
  name: 'average',
  formatTime: (timestamp) =>
    `24 hours to ${formatTimestamp(timestamp, { longMonthName: true, mode: 'datetime' })} UTC`,
}

export function InteropTransferTimeView({
  chainId,
  interopChains,
  highlightedProtocolId,
}: {
  /** The page's chain; every route offered starts or ends here. */
  chainId: string
  interopChains: InteropChainWithIcon[]
  highlightedProtocolId: string | undefined
}) {
  const trpc = useTRPC()
  const { data: routes, isLoading: areRoutesLoading } = useQuery(
    trpc.interop.transferTimeRoutes.queryOptions({ chain: chainId }),
  )
  const [route, setRoute] = useState<Route>()
  useEffect(() => {
    if (routes && !route) setRoute(getDefaultRoute(routes, chainId))
  }, [routes, route, chainId])
  const [averageRange, setAverageRange] = useState<ChartRange>(() =>
    optionToRange('90d'),
  )

  const direction = { srcChain: route?.from ?? '', dstChain: route?.to ?? '' }
  const medians = useQuery(
    trpc.interop.transferTime.queryOptions(direction, { enabled: !!route }),
  )
  const averages = useQuery(
    trpc.interop.transferTimeAverages.queryOptions(
      { ...direction, range: averageRange },
      { enabled: !!route },
    ),
  )
  const medianData = useMemo(
    () => medians.data && fromMedians(medians.data),
    [medians.data],
  )
  const averageData = useMemo(
    () => averages.data && fromAverages(averages.data),
    [averages.data],
  )

  if (!areRoutesLoading && routes?.length === 0) {
    return (
      <p className="text-paragraph-15 text-secondary">
        No transfers with a known duration in the last 7 days.
      </p>
    )
  }

  // Each route starts with every bridge shown in the legend.
  const routeKey = route ? `${route.from}>${route.to}` : 'none'
  return (
    <div className="flex flex-col gap-4">
      <RouteSelector
        routes={routes ?? []}
        route={route}
        onChange={setRoute}
        interopChains={interopChains}
      />
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-heading-18">Median, last 7 days</h3>
        <p className="text-paragraph-15">
          Median time from the transaction on the source chain to the
          transaction on the destination chain, per UTC day and bridge. Only the
          last 7 days of transfers are kept, and today is still in progress.
        </p>
        <TransferTimeChart
          key={`median:${routeKey}`}
          data={medianData}
          isLoading={medians.isLoading || !route}
          highlightedProtocolId={highlightedProtocolId}
          metric={MEDIAN_METRIC}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-heading-18">Average, longer history</h3>
          <ChartRangeControls
            name="interopTransferTimeAverage"
            value={averageRange}
            setValue={setAverageRange}
            options={[...AVERAGE_RANGE_OPTIONS]}
          />
        </div>
        <p className="text-paragraph-15">
          Average transfer time over the 24 hours before each daily snapshot.
          Only totals are stored for older days, so this is a mean: a few
          transfers that sit unclaimed for days can pull it far above the
          median.
        </p>
        <TransferTimeChart
          key={`average:${routeKey}`}
          data={averageData}
          isLoading={averages.isLoading || !route}
          highlightedProtocolId={highlightedProtocolId}
          metric={AVERAGE_METRIC}
        />
      </div>
      <p className="text-label-value-13 text-secondary">
        Hollow points are days with fewer than {LOW_SAMPLE} transfers. Grey
        points are days without transfers and repeat the last value.
      </p>
    </div>
  )
}

function RouteSelector({
  routes,
  route,
  onChange,
  interopChains,
}: {
  routes: InteropTransferTimeRoute[]
  route: Route | undefined
  onChange: (route: Route) => void
  interopChains: InteropChainWithIcon[]
}) {
  const chainsById = new Map(interopChains.map((chain) => [chain.id, chain]))
  const sources = unique(routes.map((r) => r.srcChain))
  const destinations = routes
    .filter((r) => r.srcChain === route?.from)
    .map((r) => r.dstChain)
  const canSwap =
    !!route &&
    routes.some((r) => r.srcChain === route.to && r.dstChain === route.from)

  const selectFrom = (from: string) => {
    const options = routes.filter((r) => r.srcChain === from)
    const to =
      options.find((r) => r.dstChain === route?.to)?.dstChain ??
      options[0]?.dstChain
    if (to) onChange({ from, to })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ChainSelect
        label="From"
        value={route?.from}
        options={sources}
        chainsById={chainsById}
        onChange={selectFrom}
      />
      <button
        type="button"
        aria-label="Swap direction"
        title="Swap direction"
        disabled={!canSwap}
        onClick={() => route && onChange({ from: route.to, to: route.from })}
        className={cn(
          'flex size-9 items-center justify-center rounded-lg bg-surface-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <SwapIcon className="size-4 fill-current" />
      </button>
      <ChainSelect
        label="To"
        value={route?.to}
        options={destinations}
        chainsById={chainsById}
        onChange={(to) => route && onChange({ from: route.from, to })}
      />
    </div>
  )
}

function ChainSelect({
  label,
  value,
  options,
  chainsById,
  onChange,
}: {
  label: string
  value: string | undefined
  options: string[]
  chainsById: Map<string, InteropChainWithIcon>
  onChange: (chainId: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={!value}>
      <SelectTrigger
        className="h-9 min-w-40 bg-surface-secondary"
        aria-label={`${label} chain`}
      >
        <span className="text-secondary">{label}</span>
        <SelectValue placeholder="…" />
      </SelectTrigger>
      <SelectContent className="max-h-(--radix-select-content-available-height)">
        {options.map((id) => {
          const chain = chainsById.get(id)
          return (
            <SelectItem key={id} value={id}>
              <span className="flex items-center gap-1.5">
                {chain && <img src={chain.iconUrl} alt="" className="size-4" />}
                {chain?.name ?? id}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

function TransferTimeChart({
  data,
  isLoading,
  highlightedProtocolId,
  metric,
}: {
  data: TimeSeriesData | undefined
  isLoading: boolean
  highlightedProtocolId: string | undefined
  metric: Metric
}) {
  const series = useMemo(
    () => (data ? getShownSeries(data.series, highlightedProtocolId) : []),
    [data, highlightedProtocolId],
  )
  const meta = useMemo(
    () => getMeta(series, highlightedProtocolId),
    [series, highlightedProtocolId],
  )
  const { dataKeys, toggleDataKey } = useChartDataKeys(meta)
  const visible = series.filter((s) => dataKeys.includes(s.id))
  const chartData = useMemo(
    () => (data ? toChartData(data, series) : undefined),
    [data, series],
  )
  const yTicks = useMemo(() => getYTicks(visible), [visible])
  const hiddenCount = (data?.series.length ?? 0) - series.length
  // Points stay readable on a week; on months they shrink to marks and the
  // carried-forward days are just the dashed line.
  const isLong = (data?.timestamps.length ?? 0) > 14
  const dotRadius = isLong ? 2 : 4

  return (
    <div>
      <ChartContainer
        data={chartData}
        meta={meta}
        isLoading={isLoading}
        interactiveLegend={{ dataKeys, onItemClick: toggleDataKey }}
      >
        <LineChart responsive data={chartData} margin={{ top: 20, right: 1 }}>
          <ChartLegend content={<ChartLegendContent />} />
          {series.map((s) => (
            <Line
              key={`${s.id}__carried`}
              dataKey={`${s.id}__carried`}
              legendType="none"
              hide={!dataKeys.includes(s.id)}
              stroke={CARRIED_COLOR}
              strokeOpacity={0.6}
              strokeWidth={1.5}
              strokeDasharray="3 4"
              dot={(props) => (
                <CarriedDot
                  key={props.key}
                  {...props}
                  seriesId={s.id}
                  r={isLong ? 0 : dotRadius - 0.5}
                />
              )}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
          {series.map((s) => (
            <Line
              key={s.id}
              dataKey={s.id}
              hide={!dataKeys.includes(s.id)}
              stroke={meta[s.id]?.color}
              strokeWidth={s.id === highlightedProtocolId ? 3 : 1.5}
              dot={(props) => (
                <ObservedDot
                  key={props.key}
                  {...props}
                  seriesId={s.id}
                  color={meta[s.id]?.color}
                  r={dotRadius}
                />
              )}
              isAnimationActive={false}
            />
          ))}
          <ChartTooltip
            filterNull={false}
            content={
              <TransferTimeTooltip
                data={data}
                series={visible}
                metric={metric}
              />
            }
          />
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            syncedUntil={undefined}
            // Keeps the first and last points clear of the edges and of the
            // mirrored y-axis labels.
            // A time scale, so days without a snapshot show as gaps
            // instead of being squeezed out.
            xAxis={{
              type: 'number',
              scale: 'time',
              domain: ['dataMin', 'dataMax'],
              padding: { left: 48, right: 12 },
              ...getTimeAxis(data?.timestamps ?? []),
            }}
            yAxis={{
              scale: 'log',
              domain: [yTicks[0] ?? 1, yTicks.at(-1) ?? 3600],
              ticks: yTicks,
              allowDataOverflow: true,
              tickFormatter: (value: number) => formatSeconds(value),
            }}
          />
        </LineChart>
      </ChartContainer>
      {hiddenCount > 0 && (
        <p className="mt-2 text-label-value-13 text-secondary">
          {hiddenCount} more {hiddenCount === 1 ? 'bridge' : 'bridges'} with
          fewer transfers on this route not shown.
        </p>
      )}
    </div>
  )
}

function fromMedians(data: InteropTransferTimeData): TimeSeriesData {
  return {
    timestamps: data.days,
    series: data.series.map((s) => ({
      id: s.id,
      label: s.label,
      points: s.points.map((p) => p && { value: p.median, count: p.count }),
    })),
  }
}

function fromAverages(data: InteropTransferTimeAveragesData): TimeSeriesData {
  return {
    timestamps: data.timestamps,
    series: data.series.map((s) => ({
      id: s.id,
      label: s.label,
      points: s.points.map((p) => p && { value: p.average, count: p.count }),
    })),
  }
}

/** The page's bridge plus the busiest others, one colour each. */
function getShownSeries(
  series: Series[],
  highlightedProtocolId: string | undefined,
): Series[] {
  const highlighted = series.filter((s) => s.id === highlightedProtocolId)
  const others = series
    .filter((s) => s.id !== highlightedProtocolId)
    .slice(0, COLORS.length)
  return [...highlighted, ...others]
}

function getDefaultRoute(
  routes: InteropTransferTimeRoute[],
  chainId: string,
): Route | undefined {
  const preferred =
    routes.find((r) => r.srcChain === 'ethereum' && r.dstChain === chainId) ??
    routes.find((r) => r.dstChain === chainId) ??
    routes[0]
  return preferred && { from: preferred.srcChain, to: preferred.dstChain }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

interface DotProps {
  cx?: number
  cy?: number
  payload?: ChartPoint
  seriesId: string
  r: number
}

function ObservedDot({
  cx,
  cy,
  payload,
  seriesId,
  color,
  r,
}: DotProps & { color: string | undefined }) {
  const count = payload?.[`${seriesId}__count`]
  if (cx === undefined || cy === undefined || count == null) return <g />
  const hollow = count < LOW_SAMPLE
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={hollow ? 'var(--surface-primary)' : color}
      stroke={color}
      strokeWidth={r > 2 ? 2 : 1.5}
    />
  )
}

function CarriedDot({ cx, cy, payload, seriesId, r }: DotProps) {
  if (
    r <= 0 ||
    cx === undefined ||
    cy === undefined ||
    payload?.[`${seriesId}__count`] != null ||
    payload?.[`${seriesId}__carried`] == null
  ) {
    return <g />
  }
  return <circle cx={cx} cy={cy} r={r} fill={CARRIED_COLOR} />
}

function TransferTimeTooltip({
  payload,
  label,
  data,
  series,
  metric,
}: CustomChartTooltipProps & {
  data: TimeSeriesData | undefined
  series: Series[]
  metric: Metric
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number' || !data) return null
  const index = data.timestamps.indexOf(label)
  if (index === -1) return null

  return (
    <ChartTooltipWrapper>
      <div className="mb-2 font-medium text-label-value-14 text-secondary">
        {metric.formatTime(label, index === data.timestamps.length - 1)}
      </div>
      <div className="flex flex-col gap-2">
        {series.map((s) => {
          const point = s.points[index]
          const carriedFrom = point ? undefined : findCarried(s, index)
          if (!point && !carriedFrom) return null
          return (
            <div key={s.id} className="flex flex-col">
              <div className="flex items-center justify-between gap-x-6">
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    type={{ shape: 'line' }}
                    backgroundColor={point ? meta[s.id]?.color : CARRIED_COLOR}
                  />
                  <span className="font-medium text-label-value-14">
                    {s.label}
                  </span>
                </div>
                <span
                  className={cn(
                    'font-medium text-label-value-15 tabular-nums',
                    !point && 'text-secondary',
                  )}
                >
                  {formatSeconds((point ?? carriedFrom?.point)?.value ?? 0)}
                </span>
              </div>
              <span className="pl-4 text-label-value-12 text-secondary">
                {point
                  ? `${point.count} ${point.count === 1 ? 'transfer' : 'transfers'}`
                  : `No transfers, ${formatTimestamp(data.timestamps[carriedFrom?.index ?? 0] ?? 0)} ${metric.name}`}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}

function findCarried(series: Series, index: number) {
  for (let i = index - 1; i >= 0; i--) {
    const point = series.points[i]
    if (point) return { point, index: i }
  }
  return undefined
}

function getMeta(
  series: Series[],
  highlightedProtocolId: string | undefined,
): ChartMeta {
  let next = 0
  return Object.fromEntries(
    series.map((s) => [
      s.id,
      {
        label: s.label,
        color:
          s.id === highlightedProtocolId
            ? HIGHLIGHT_COLOR
            : (COLORS[next++] ?? CARRIED_COLOR),
        indicatorType: { shape: 'line' as const },
      },
    ]),
  )
}

/**
 * Each series becomes three keys: its observed values (null on empty days),
 * the dashed carry-forward line over empty days and the day's transfer count.
 * The carry-forward line also takes the observed points around a gap so it
 * joins up with the solid line.
 */
function toChartData(data: TimeSeriesData, series: Series[]): ChartPoint[] {
  const points: ChartPoint[] = data.timestamps.map((timestamp) => ({
    timestamp,
  }))
  for (const s of series) {
    const carried = s.points.map((p, i) =>
      p ? undefined : atLeastOne(findCarried(s, i)?.point.value),
    )
    s.points.forEach((p, i) => {
      const point = points[i]
      if (!point) return
      point[s.id] = p ? Math.max(1, p.value) : null
      point[`${s.id}__count`] = p?.count ?? null
      const touchesGap =
        carried[i - 1] !== undefined || carried[i + 1] !== undefined
      point[`${s.id}__carried`] =
        carried[i] ?? (p && touchesGap ? Math.max(1, p.value) : null)
    })
  }
  return points
}

/**
 * Ticks on a time scale: a day each on a week, Mondays on up to two months,
 * the 1st of each month beyond that.
 */
function getTimeAxis(timestamps: number[]) {
  const first = timestamps[0]
  const last = timestamps.at(-1)
  if (first === undefined || last === undefined) return { ticks: [] }
  const days = (last - first) / UnixTime.DAY
  const ticks: number[] = []
  for (
    let day = UnixTime.toStartOf(first, 'day');
    day <= last;
    day += UnixTime.DAY
  ) {
    if (day < first) continue
    const date = UnixTime.toDate(day)
    if (
      days <= 8 ||
      (days <= 62 && date.getUTCDay() === 1) ||
      (days > 62 && date.getUTCDate() === 1)
    ) {
      ticks.push(day)
    }
  }
  return { ticks, tickFormatter: getTickFormatter(days) }
}

/** The time axis is logarithmic, so sub-second values sit on 1s. */
function atLeastOne(value: number | undefined) {
  return value === undefined ? undefined : Math.max(1, value)
}

function getYTicks(series: Series[]): number[] {
  const values = series.flatMap((s) =>
    s.points.flatMap((p) => (p ? [p.value] : [])),
  )
  if (values.length === 0) return [1, 60, 3600]
  const min = Math.max(1, Math.min(...values))
  const max = Math.max(...values)
  const low = LOG_TICKS.findLast((t) => t <= min) ?? 1
  const high = LOG_TICKS.find((t) => t >= max) ?? (LOG_TICKS.at(-1) as number)
  return LOG_TICKS.filter((t) => t >= low && t <= high)
}
