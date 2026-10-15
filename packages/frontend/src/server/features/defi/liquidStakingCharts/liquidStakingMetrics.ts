import { pluralize } from '@l2beat/shared-pure'
import type {
  DefiLiquidStakingChartProject,
  DefiLiquidStakingCharts,
  LiquidStakingChartSeries,
} from './getDefiLiquidStakingCharts'

/** A timestamp plus one value per project id. */
export interface LiquidStakingChartPoint {
  timestamp: number
  [projectId: string]: number | null
}

export interface LiquidStakingSeries {
  projects: DefiLiquidStakingChartProject[]
  data: LiquidStakingChartPoint[]
}

/** One series of the snapshot as chart points, for the projects that carry it. */
export function getLiquidStakingSeries(
  charts: DefiLiquidStakingCharts,
  key: LiquidStakingChartSeries,
): LiquidStakingSeries {
  const projects = charts.projects.filter(
    (project) => charts.series[key][project.id] !== undefined,
  )
  const data = charts.timestamps.map((timestamp, index) => {
    const point: LiquidStakingChartPoint = { timestamp }
    for (const project of projects) {
      point[project.id] = charts.series[key][project.id]?.[index] ?? null
    }
    return point
  })
  return { projects, data }
}

/** The one protocol whose exit is a burn against a buffer, not a queue. */
const BURN_BUFFER_PROJECT = 'rocketpool'

const DISCOUNT_WINDOW = 7

/**
 * Days of staking yield a holder gives up to exit on each day, by the cheaper
 * of two routes. Withdrawing with the protocol costs the days of the wait,
 * because a queued withdrawal earns nothing. Selling on the market costs the
 * discount to the oracle rate, expressed in days of the token's own yield.
 * Rocket Pool has no queue: its burn is free while the burn buffer holds ETH
 * and impossible while it is empty, which leaves the market.
 */
export function getExitCost(
  wait: LiquidStakingSeries,
  premium: LiquidStakingSeries,
  apr: LiquidStakingSeries,
): LiquidStakingSeries {
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
  // A queue wait is only known once the day's requests are served.
  return withoutIncompleteTail({ projects: wait.projects, data })
}

/**
 * The series without its newest days that lack a value for some project, so
 * every day charted shows every project.
 */
export function withoutIncompleteTail(
  series: LiquidStakingSeries,
): LiquidStakingSeries {
  let end = series.data.length
  while (
    end > 0 &&
    series.projects.some(
      (project) => series.data[end - 1]?.[project.id] === null,
    )
  ) {
    end--
  }
  return { projects: series.projects, data: series.data.slice(0, end) }
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

export interface LiquidStakingMetric {
  value: number
  /** UTC date of the last snapshot day with a value, which the series' end may lack. */
  date: string
}

/** The end of each project's chart lines. */
export interface LiquidStakingMetrics {
  /** UTC date of the last snapshot day. */
  asOf: string
  /** Rate-implied yield over the previous 30 days, as a fraction. */
  yield30d?: LiquidStakingMetric
  /** Days of yield an exit cost. */
  exitCostDays?: LiquidStakingMetric
}

/**
 * The latest value of each charted metric per project, from the same series
 * the charts draw: the table and the project page show the end of each line.
 */
export function getLiquidStakingMetrics(
  asOf: string,
  apr: LiquidStakingSeries,
  exitCost: LiquidStakingSeries,
): Record<string, LiquidStakingMetrics> {
  const metrics: Record<string, LiquidStakingMetrics> = {}
  for (const project of apr.projects) {
    metrics[project.id] = {
      asOf,
      yield30d: lastValue(apr.data, project.id),
      exitCostDays: lastValue(exitCost.data, project.id),
    }
  }
  return metrics
}

/**
 * The last point with a value: a withdrawal wait is only known once the
 * request is served, so the newest days of a queue series are empty.
 */
function lastValue(
  data: LiquidStakingChartPoint[],
  projectId: string,
): LiquidStakingMetric | undefined {
  for (let i = data.length - 1; i >= 0; i--) {
    const point = data[i]
    const value = point?.[projectId]
    if (point && value !== null && value !== undefined) {
      return {
        value,
        date: new Date(point.timestamp * 1000).toISOString().slice(0, 10),
      }
    }
  }
  return undefined
}

/** A cost of exit as shown: one decimal, "day" when it rounds to 1. */
export function formatDays(value: number) {
  const rounded = value.toFixed(1)
  return `${rounded} ${pluralize(Number(rounded), 'day')}`
}
