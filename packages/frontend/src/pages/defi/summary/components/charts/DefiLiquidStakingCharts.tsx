import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
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

/** The one protocol whose exit is a burn against a buffer, not a queue. */
const BURN_BUFFER_PROJECT = 'rocketpool'

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
  const exitDays = series('exitDays')
  const timeRange = getChartTimeRangeFromData(apr.data)
  const exitCost = getExitCost(exitDays, premium, apr)

  // In `exitDays` the burn buffer project has no value on a day its buffer
  // held under 1 ETH.
  const bufferCharted = exitDays.projects.some(
    (project) => project.id === BURN_BUFFER_PROJECT,
  )
  const bufferEmptyDays = exitDays.data.filter(
    (point) => point[BURN_BUFFER_PROJECT] === null,
  ).length
  const snapshot = `Static snapshot up to ${charts.asOf}.`

  return (
    <div className="grid gap-x-6 gap-y-8 lg:grid-cols-2">
      <ChartBlock
        title="Rate-implied yield, 30-day trailing"
        info={`Annualised drift of each token's own oracle rate over the previous 30 days: the yield a holder received, net of protocol fees. ${snapshot}`}
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
        title="Cost of exit, in days of yield"
        info={[
          'Days of staking yield a holder gives up to exit, by the cheaper route: waiting for a protocol withdrawal, which earns nothing while queued, or selling at the market discount.',
          'The discount is a 7-day median of quoted prices, before swap fees and price impact. For wBETH the wait is the operator-set lock time.',
          bufferCharted &&
            `Rocket Pool has no queue: burning is free while its burn buffer holds ETH, which it did not on ${bufferEmptyDays} of ${exitDays.data.length} days.`,
          snapshot,
        ]
          .filter(Boolean)
          .join(' ')}
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          projects={exitCost.projects}
          colors={colors}
          data={exitCost.data}
          formatYAxisLabel={(value) => `${value.toFixed(0)}d`}
          formatTooltipValue={(value) => `${value.toFixed(1)} days of yield`}
        />
      </ChartBlock>
    </div>
  )
}

function ChartBlock({
  title,
  info,
  timeRange,
  children,
}: {
  title: string
  /** What the chart measures and where the data comes from. */
  info: string
  timeRange: [number, number] | undefined
  children: ReactNode
}) {
  // Heading and chart sit on rows shared with the neighbouring block, so the
  // two charts of a row line up whatever the length of their headings.
  return (
    <div className="row-span-2 grid grid-cols-1 grid-rows-subgrid gap-y-0">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg md:text-xl">{title}</h2>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3.5 fill-blue-700" />
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        </div>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <div>{children}</div>
    </div>
  )
}

interface ChartSeries {
  projects: DefiLiquidStakingChartProject[]
  data: LiquidStakingChartPoint[]
}

const DISCOUNT_WINDOW = 7

/**
 * Days of staking yield a holder gives up to exit on each day, by the cheaper
 * of two routes. Withdrawing with the protocol costs the days of the wait,
 * because a queued withdrawal earns nothing. Selling on the market costs the
 * discount to the oracle rate, expressed in days of the token's own yield.
 * Rocket Pool has no queue: its burn is free while the burn buffer holds ETH
 * and impossible while it is empty, which leaves the market.
 */
function getExitCost(
  wait: ChartSeries,
  premium: ChartSeries,
  apr: ChartSeries,
): ChartSeries {
  const data = wait.data.map((point, index) => {
    const cost: LiquidStakingChartPoint = { timestamp: point.timestamp }
    for (const project of wait.projects) {
      const noQueue = project.id === BURN_BUFFER_PROJECT
      const waitDays =
        point[project.id] ?? (noQueue ? Number.POSITIVE_INFINITY : null)
      const discount = trailingMedian(premium.data, project.id, index)
      const yearlyYield = apr.data[index]?.[project.id]
      const marketDays =
        discount !== null && yearlyYield !== null && yearlyYield !== undefined
          ? yearlyYield > 0
            ? (Math.max(0, -discount) * 365) / yearlyYield
            : null
          : null
      const cheapest =
        waitDays === null
          ? null
          : Math.min(waitDays, marketDays ?? Number.POSITIVE_INFINITY)
      cost[project.id] =
        cheapest === null || !Number.isFinite(cheapest) ? null : cheapest
    }
    return cost
  })
  return { projects: wait.projects, data }
}

/** Median of the last `DISCOUNT_WINDOW` values up to `index`, nulls skipped. */
function trailingMedian(
  data: LiquidStakingChartPoint[],
  projectId: string,
  index: number,
) {
  const values = data
    .slice(Math.max(0, index - DISCOUNT_WINDOW + 1), index + 1)
    .map((point) => point[projectId])
    .filter((value): value is number => value !== null && value !== undefined)
    .sort((a, b) => a - b)
  return values[Math.floor(values.length / 2)] ?? null
}

function formatPercent(value: number, decimals: number) {
  return `${(value * 100).toFixed(decimals)}%`
}

export type { DefiLiquidStakingChartProject }
