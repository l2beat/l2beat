import { UnixTime } from '@l2beat/shared-pure'
import type { LiquidStakingTvlPoint } from './getLiquidStakingCharts'

/**
 * A day of the value locked chart, split up. Amounts are in ETH (or another
 * unit, see `inUnit` on the page); each is null when it is unknown, and a part
 * that would come out below zero is unknown, since its inputs disagree.
 */
export interface TvlBreakdown {
  timestamp: number
  /** By project id, the ETH its tokens stand for at its own rate. */
  projects: Record<string, number | null>
  /** The listed protocols together; null when any is missing. */
  liquid: number | null
  /** The rest of the stake: solo, through exchanges or unlisted protocols. */
  others: number | null
  /** ETH staked network-wide. */
  staked: number | null
  /** The supply that is not staked. */
  notStaked: number | null
  /** ETH in existence. */
  supply: number | null
  /** ETH's USD price. */
  ethPrice: number | null
}

export function toBreakdown(
  point: LiquidStakingTvlPoint,
  projectIds: string[],
): TvlBreakdown {
  const projects: Record<string, number | null> = {}
  let liquid: number | null = 0
  for (const id of projectIds) {
    const value = point.projects[id] ?? null
    projects[id] = value
    liquid = liquid !== null && value !== null ? liquid + value : null
  }
  return {
    timestamp: point.timestamp,
    projects,
    liquid,
    others: difference(point.ethStaked, liquid),
    staked: point.ethStaked,
    notStaked: difference(point.ethSupply, point.ethStaked),
    supply: point.ethSupply,
    ethPrice: point.ethPrice,
  }
}

function difference(total: number | null, part: number | null) {
  return total !== null && part !== null && total >= part ? total - part : null
}

/** A change in ETH, relative and absolute, between two days. */
export interface EthChange {
  value: number
  eth: number
  since: number
  until: number
}

/** The numbers beside the value locked chart. */
export interface LiquidStakingTvlSummary {
  /**
   * The latest day with the stake and every protocol, so its parts add up;
   * the supply can still be missing.
   */
  latest: TvlBreakdown
  /** Over the year to the latest stake. */
  stakeChange?: EthChange
  /** Over the year to the latest supply. */
  supplyChange?: EthChange
}

export function getLiquidStakingTvlSummary(
  points: LiquidStakingTvlPoint[],
  projectIds: string[],
): LiquidStakingTvlSummary | undefined {
  const breakdowns = points.map((point) => toBreakdown(point, projectIds))
  const latest = breakdowns.findLast((breakdown) => breakdown.others !== null)
  if (!latest) return undefined
  return {
    latest,
    stakeChange: getYearChange(breakdowns, (b) => b.staked),
    supplyChange: getYearChange(breakdowns, (b) => b.supply),
  }
}

/**
 * From the first day within a year of the latest value to that value, so a
 * history a day short of a year still has a change, dated by its first day.
 */
export function getYearChange(
  breakdowns: TvlBreakdown[],
  pick: (breakdown: TvlBreakdown) => number | null,
): EthChange | undefined {
  const known = breakdowns.flatMap((breakdown) => {
    const value = pick(breakdown)
    return value !== null && value > 0
      ? [{ timestamp: breakdown.timestamp, value }]
      : []
  })
  const latest = known.at(-1)
  if (!latest) return undefined
  const from = latest.timestamp - 365 * UnixTime.DAY
  const first = known.find((day) => day.timestamp >= from)
  if (!first || first === latest) return undefined
  return {
    value: latest.value / first.value - 1,
    eth: latest.value - first.value,
    since: first.timestamp,
    until: latest.timestamp,
  }
}
