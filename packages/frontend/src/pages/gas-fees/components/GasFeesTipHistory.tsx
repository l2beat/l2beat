import { scaleLog } from 'd3-scale'
import { useMemo, useState } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { ChartTooltipWrapper } from '~/components/core/chart/ChartTooltip'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { formatRange, MONTHS, parseTimestamp } from '~/utils/dates'
import { formatFee, formatFeeTick } from './metrics'
import mock from './pageMock.json'

type Tier = keyof typeof mock.record

const TARGET = 95
const WORST_WEEK = 90
const WEEK = 7 * 86400
/** A log axis has no zero, so weeks with nothing overpaid sit on this floor */
const SMALLEST_USD = 1e-6

const OVERPAID_META: ChartMeta = {
  over: {
    label: 'Above the lowest tip for 95%',
    color: 'var(--chart-stacked-blue)',
    indicatorType: { shape: 'line' },
  },
}

/** The estimator's record, replayed against Flashbots mempool data */
export function GasFeesTipHistory() {
  return (
    <div className="flex flex-col gap-8">
      <FastTipHistory />
      <TrackRecord />
    </div>
  )
}

const FAST_META: ChartMeta = {
  two: {
    label: '2 gwei',
    color: 'var(--chart-stacked-pink)',
    indicatorType: { shape: 'line' },
  },
  tip: {
    label: 'Our fast tip',
    color: 'var(--chart-stacked-blue)',
    indicatorType: { shape: 'line' },
  },
  needed: {
    label: 'Lowest tip for 95%, in hindsight',
    color: 'var(--secondary)',
    indicatorType: { shape: 'line' },
  },
}

function FastTipHistory() {
  const points = mock.fastHistory
  const xAxis = useMemo(() => getMonthAxis(points), [points])
  const timeRange = useMemo(() => getChartTimeRangeFromData(points), [points])
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-bold text-lg">Fast tip over time</h3>
        <div className="flex flex-wrap items-center gap-2 text-secondary text-xs">
          <ChartTimeRange isPlaceholderData={false} timeRange={timeRange} />
          <span>Gwei, log scale, median hour of each week, replayed.</span>
        </div>
      </div>
      <ChartContainer
        data={points}
        meta={FAST_META}
        isPlaceholderData={false}
        legend
      >
        <TimeSeriesChart
          data={points}
          ariaLabel="Our fast tip and the lowest tip for 95% by week, against a flat line at 2 gwei"
          xAxis={xAxis}
          series={[
            { key: 'two', stroke: 'var(--chart-stacked-pink)', strokeWidth: 2 },
            {
              key: 'needed',
              stroke: 'var(--secondary)',
              strokeWidth: 1.5,
            },
            {
              key: 'tip',
              stroke: 'var(--chart-stacked-blue)',
              strokeWidth: 2.5,
            },
          ]}
          yAxis={{
            scale: scaleLog,
            domain: [1e-3, 10] as const,
            ticks: [1e-3, 0.01, 0.1, 1, 10],
            format: (value) => `${Number(value.toPrecision(1))}`,
          }}
          renderTooltip={(row) => (
            <ChartTooltipWrapper>
              <div className="flex w-56 flex-col gap-1 text-xs tabular-nums">
                <span className="text-secondary">
                  {formatRange(row.timestamp, row.timestamp + WEEK)}
                </span>
                <span className="flex justify-between gap-2">
                  Our fast tip <b>{row.tip} gwei</b>
                </span>
                <span className="flex justify-between gap-2">
                  Lowest tip for 95%, in hindsight <b>{row.needed} gwei</b>
                </span>
              </div>
            </ChartTooltipWrapper>
          )}
        />
      </ChartContainer>
    </div>
  )
}

function TrackRecord() {
  const [tierKey, setTierKey] = useState<Tier>('fast')
  const tier = mock.tiers.find((t) => t.key === tierKey)
  const points = mock.record[tierKey]
  const xAxis = useMemo(() => getMonthAxis(points), [points])
  const timeRange = useMemo(() => getChartTimeRangeFromData(points), [points])
  if (!tier) return null
  const landedLabel = `Landed ${tier.wait}`
  const landedMeta: ChartMeta = {
    landed: {
      label: landedLabel,
      color: 'var(--chart-stacked-blue)',
      indicatorType: { shape: 'line' },
    },
    target: {
      label: `${TARGET}% over any 6 months`,
      color: 'var(--chart-stacked-pink)',
      indicatorType: { shape: 'line' },
    },
    floor: {
      label: `Never below ${WORST_WEEK}% in a week`,
      color: 'var(--secondary)',
      indicatorType: { shape: 'line' },
    },
  }
  const reached = points.filter((p) => p.landed >= TARGET).length
  const worst = Math.min(...points.map((p) => p.landed))
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg">Track record</h3>
          <div className="flex flex-wrap items-center gap-2 text-secondary text-xs">
            <ChartTimeRange isPlaceholderData={false} timeRange={timeRange} />
            <span>
              Our {tier.name.toLowerCase()} tip, replayed by week. Promise:{' '}
              {TARGET}% of transactions at this tip land {tier.wait} over any 6
              months, never fewer than {WORST_WEEK}% in a week. {reached} of{' '}
              {points.length} weeks reached {TARGET}%, and the worst was {worst}
              %.
            </span>
          </div>
        </div>
        <RadioGroup
          name="gasFeesTier"
          value={tierKey}
          onValueChange={(value) => setTierKey(value as Tier)}
        >
          {mock.tiers.map((t) => (
            <RadioGroupItem key={t.key} value={t.key}>
              {t.name}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm">{landedLabel}</h3>
          <ChartContainer
            data={points}
            meta={landedMeta}
            isPlaceholderData={false}
            legend
          >
            <TimeSeriesChart
              data={points}
              ariaLabel="Share of transactions landing in time by week, against our promise of 95% over any 6 months and never below 90% in a week"
              syncId="gasFeesRecord"
              xAxis={xAxis}
              series={[
                {
                  key: 'target',
                  stroke: 'var(--chart-stacked-pink)',
                  strokeWidth: 1.5,
                  strokeDasharray: '4 3',
                },
                {
                  key: 'floor',
                  value: () => WORST_WEEK,
                  stroke: 'var(--secondary)',
                  strokeWidth: 1.5,
                  strokeDasharray: '2 3',
                },
                {
                  key: 'landed',
                  stroke: 'var(--chart-stacked-blue)',
                  strokeWidth: 2.5,
                },
              ]}
              yAxis={{
                domain: [85, 100] as const,
                ticks: [85, 90, 95, 100],
                format: (value) => `${value}%`,
              }}
              renderTooltip={(row) => (
                <Tooltip timestamp={row.timestamp}>
                  {landedLabel} <b>{row.landed}%</b>
                </Tooltip>
              )}
            />
          </ChartContainer>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm">
            Above the lowest tip for 95%, per ERC-20 transfer, log scale
          </h3>
          <ChartContainer
            data={points}
            meta={OVERPAID_META}
            isPlaceholderData={false}
          >
            <TimeSeriesChart
              data={points}
              ariaLabel="Typical amount above the lowest tip for 95% on an ERC-20 transfer by week"
              syncId="gasFeesRecord"
              xAxis={xAxis}
              series={[
                {
                  key: 'over',
                  value: (row) => Math.max(row.over, SMALLEST_USD),
                  stroke: 'var(--chart-stacked-blue)',
                  strokeWidth: 2.5,
                },
              ]}
              yAxis={{
                scale: scaleLog,
                domain: [SMALLEST_USD, 1] as const,
                ticks: [SMALLEST_USD, 1e-4, 0.01, 1],
                format: (value) =>
                  value <= SMALLEST_USD ? '$0' : formatFeeTick(value),
              }}
              renderTooltip={(row) => (
                <Tooltip timestamp={row.timestamp}>
                  Above the lowest tip for 95% <b>{formatFee(row.over)}</b>
                </Tooltip>
              )}
            />
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

function Tooltip({
  timestamp,
  children,
}: {
  timestamp: number
  children: React.ReactNode
}) {
  return (
    <ChartTooltipWrapper>
      <div className="flex w-56 flex-col gap-1 text-xs tabular-nums">
        <span className="text-secondary">
          {formatRange(timestamp, timestamp + WEEK)}
        </span>
        <span className="flex justify-between gap-2">{children}</span>
      </div>
    </ChartTooltipWrapper>
  )
}

function getMonthAxis(points: { timestamp: number }[]) {
  const first = points[0]?.timestamp ?? 0
  const last = points.at(-1)?.timestamp ?? 0
  const start = new Date(first * 1000)
  const ticks: number[] = []
  for (let i = 1; ; i++) {
    const tick =
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1) / 1000
    if (tick >= last) break
    if (new Date(tick * 1000).getUTCMonth() % 6 === 0) ticks.push(tick)
  }
  return {
    ticks,
    domain: [first, last] as const,
    format: (timestamp: number) => {
      const { month, year } = parseTimestamp(timestamp)
      return `${MONTHS[month]?.shortName} ‘${year.slice(-2)}`
    },
  }
}
