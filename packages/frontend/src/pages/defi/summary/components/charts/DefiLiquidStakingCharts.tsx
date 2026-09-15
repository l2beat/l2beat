import { formatInteger } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type {
  DefiLiquidStakingChartProject,
  DefiLiquidStakingCharts as DefiLiquidStakingChartsData,
  LiquidStakingChartSeries,
} from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { generateAccessibleColors } from '~/utils/generateColors'
import {
  type LiquidStakingChartPoint,
  LiquidStakingLineChart,
} from './LiquidStakingLineChart'

export function DefiLiquidStakingCharts({
  charts,
}: {
  charts: DefiLiquidStakingChartsData
}) {
  const colors = useMemo(() => {
    const palette = generateAccessibleColors(charts.projects.length)
    return Object.fromEntries(
      charts.projects.map((project, index) => [
        project.id,
        palette[index] ?? 'var(--secondary)',
      ]),
    )
  }, [charts.projects])

  const series = (
    key: LiquidStakingChartSeries,
    transform?: (value: number) => number,
  ) => {
    const projects = charts.projects.filter(
      (project) => charts.series[key][project.id] !== undefined,
    )
    const data = charts.timestamps.map((timestamp, index) => {
      const point: LiquidStakingChartPoint = { timestamp }
      for (const project of projects) {
        const value = charts.series[key][project.id]?.[index] ?? null
        point[project.id] =
          value === null ? null : transform ? transform(value) : value
      }
      return point
    })
    return { projects, data }
  }

  const apr = series('apr30')
  const premium = series('premium')
  const liquidShare = withEthAmounts(
    monthlyMedian(series('liquidShare'), (value) => value),
    monthlyMedian(series('liquidEth'), (value) => value),
  )
  const netFlow = series('netFlow')
  const exitDays = series('exitDays')
  const timeRange = getChartTimeRangeFromData(apr.data)

  return (
    <div className="grid gap-x-6 gap-y-8 lg:grid-cols-2">
      <ChartBlock
        title="Rate-implied yield, 30-day trailing"
        description="Annualised drift of each token's own oracle rate over the previous 30 days, the yield a holder received net of protocol fees."
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          projects={apr.projects}
          colors={colors}
          data={apr.data}
          formatYAxisLabel={(value) => formatPercent(value, 1)}
          formatTooltipValue={(value) => formatPercent(value, 2)}
        />
      </ChartBlock>
      <ChartBlock
        title="Market price vs oracle rate"
        description="Market ETH per token divided by the oracle rate, minus one, in basis points."
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          projects={premium.projects}
          colors={colors}
          data={premium.data}
          formatYAxisLabel={(value) => `${Math.round(value * 1e4)} bp`}
          formatTooltipValue={(value) => `${(value * 1e4).toFixed(1)} bp`}
        />
      </ChartBlock>
      <ChartBlock
        className="lg:col-span-2"
        title="ETH on hand for redemptions, as a share of backing"
        description="ETH held where it can pay redemptions without exiting a validator, as a monthly median."
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          chartType="bar"
          projects={liquidShare.projects}
          colors={colors}
          data={liquidShare.data}
          formatLabel={formatMonth}
          formatYAxisLabel={(share) => formatPercent(share, 1)}
          formatTooltipValue={(share, point, projectId) => {
            const eth = point[ethKey(projectId)]
            const text = formatPercent(share, 3)
            return eth === null || eth === undefined
              ? text
              : `${text} · ${formatInteger(Math.round(eth))} ETH`
          }}
        />
      </ChartBlock>
      <ChartBlock
        title="Cumulative net flow"
        description="Deposits minus redemption requests, cumulated from the start of the snapshot."
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          projects={netFlow.projects}
          colors={colors}
          data={netFlow.data}
          formatYAxisLabel={(value) => formatEth(value, 1)}
          formatTooltipValue={(value) => formatEth(value, 2)}
        />
      </ChartBlock>
      <ChartBlock
        title="Time to exit"
        description="Days from the last withdrawal request made each day to its finalization."
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          projects={exitDays.projects}
          colors={colors}
          data={exitDays.data}
          labels={{ wbeth: 'wBETH (lock floor)' }}
          formatYAxisLabel={(value) => `${value.toFixed(0)}d`}
          formatTooltipValue={(value) => `${value.toFixed(1)} days`}
        />
      </ChartBlock>
    </div>
  )
}

function ChartBlock({
  className,
  title,
  description,
  timeRange,
  children,
}: {
  className?: string
  title: string
  description: string
  timeRange: [number, number] | undefined
  children: ReactNode
}) {
  return (
    <div className={className}>
      <div className="mb-3">
        <h2 className="font-bold text-lg md:text-xl">{title}</h2>
        <p className="mt-1 text-secondary text-xs md:text-sm">{description}</p>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      {children}
    </div>
  )
}

/**
 * One point per UTC month holding the median of each project's daily values,
 * with null days ignored and `transform` applied to the median.
 */
function monthlyMedian(
  {
    projects,
    data,
  }: {
    projects: DefiLiquidStakingChartProject[]
    data: LiquidStakingChartPoint[]
  },
  transform: (value: number) => number,
) {
  const buckets = new Map<number, LiquidStakingChartPoint[]>()
  for (const point of data) {
    const date = new Date(point.timestamp * 1000)
    const month = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1) / 1000
    const bucket = buckets.get(month)
    if (bucket) {
      bucket.push(point)
    } else {
      buckets.set(month, [point])
    }
  }
  const monthly = [...buckets.entries()].map(([timestamp, points]) => {
    const point: LiquidStakingChartPoint = { timestamp }
    for (const project of projects) {
      const values = points
        .map((p) => p[project.id])
        .filter((v): v is number => v !== null && v !== undefined)
        .sort((a, b) => a - b)
      const median = values[Math.floor(values.length / 2)]
      point[project.id] = median === undefined ? null : transform(median)
    }
    return point
  })
  return { projects, data: monthly }
}

const ethKey = (projectId: string) => `${projectId}:eth`

/** Copies each project's value from `amounts` onto `shares` under `<id>:eth`. */
function withEthAmounts(
  shares: {
    projects: DefiLiquidStakingChartProject[]
    data: LiquidStakingChartPoint[]
  },
  amounts: {
    projects: DefiLiquidStakingChartProject[]
    data: LiquidStakingChartPoint[]
  },
) {
  const amountByTimestamp = new Map(
    amounts.data.map((point) => [point.timestamp, point]),
  )
  return {
    projects: shares.projects,
    data: shares.data.map((point) => {
      const amount = amountByTimestamp.get(point.timestamp)
      const merged: LiquidStakingChartPoint = { ...point }
      for (const project of shares.projects) {
        merged[ethKey(project.id)] = amount?.[project.id] ?? null
      }
      return merged
    }),
  }
}

function formatMonth(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatPercent(value: number, decimals: number) {
  return `${(value * 100).toFixed(decimals)}%`
}

function formatEth(value: number, decimals: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(decimals)}M ETH`
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(0)}k ETH`
  return `${sign}${abs.toFixed(0)} ETH`
}

export type { DefiLiquidStakingChartProject }
