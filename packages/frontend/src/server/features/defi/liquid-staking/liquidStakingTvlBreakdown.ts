import { UnixTime } from '@l2beat/shared-pure'

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
  /** ETH in existence; null when below the stake, which it can't be. */
  supply: number | null
  /** ETH's USD price. */
  ethPrice: number | null
}

/** A day with the stake and every protocol, so the stake splits up fully. */
export interface CompleteTvlBreakdown extends TvlBreakdown {
  projects: Record<string, number>
  liquid: number
  others: number
  staked: number
}

/** The day's parts, from what was read for it. */
export function toBreakdown(
  day: Pick<
    TvlBreakdown,
    'timestamp' | 'projects' | 'staked' | 'supply' | 'ethPrice'
  >,
): TvlBreakdown {
  let liquid: number | null = 0
  for (const value of Object.values(day.projects)) {
    liquid = liquid !== null && value !== null ? liquid + value : null
  }
  const supply =
    day.supply !== null && day.staked !== null && day.supply < day.staked
      ? null
      : day.supply
  return {
    ...day,
    liquid,
    others: difference(day.staked, liquid),
    supply,
    notStaked: difference(supply, day.staked),
  }
}

export function isComplete(
  breakdown: TvlBreakdown,
): breakdown is CompleteTvlBreakdown {
  return (
    breakdown.liquid !== null &&
    breakdown.others !== null &&
    breakdown.staked !== null &&
    breakdown.staked > 0
  )
}

function difference(total: number | null, part: number | null) {
  return total !== null && part !== null && total >= part ? total - part : null
}

/** How far back a yearly change looks. */
export const YEAR_CHANGE_DAYS = 365

/** A change in ETH, relative and absolute, between two days. */
export interface EthChange {
  value: number
  eth: number
  since: number
  until: number
}

/** The numbers beside the value locked chart. */
export interface LiquidStakingTvlSummary {
  /** The latest complete day, so its parts add up; the supply can be missing. */
  latest: CompleteTvlBreakdown
  /** Over the year to `latest`. */
  stakeChange?: EthChange
  /** Over the year to `latest`; none when `latest` has no supply. */
  supplyChange?: EthChange
}

export function getLiquidStakingTvlSummary(
  breakdowns: TvlBreakdown[],
): LiquidStakingTvlSummary | undefined {
  const latest = breakdowns.findLast(isComplete)
  if (!latest) return undefined
  // Up to the same day, so the whole summary is as of one date.
  const upToLatest = breakdowns.filter(
    (breakdown) => breakdown.timestamp <= latest.timestamp,
  )
  return {
    latest,
    stakeChange: getYearChange(upToLatest, (b) => b.staked),
    supplyChange:
      latest.supply !== null
        ? getYearChange(upToLatest, (b) => b.supply)
        : undefined,
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
  const from = latest.timestamp - YEAR_CHANGE_DAYS * UnixTime.DAY
  const first = known.find((day) => day.timestamp >= from)
  if (!first || first === latest) return undefined
  return {
    value: latest.value / first.value - 1,
    eth: latest.value - first.value,
    since: first.timestamp,
    until: latest.timestamp,
  }
}
