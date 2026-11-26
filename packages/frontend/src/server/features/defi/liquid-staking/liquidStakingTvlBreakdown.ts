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

/** A change in ETH, relative and absolute, between two days. */
export interface EthChange {
  value: number
  eth: number
  since: number
  until: number
}

/** The latest complete day, so its parts add up; the supply can be missing. */
export function getLatestComplete(
  breakdowns: TvlBreakdown[],
): CompleteTvlBreakdown | undefined {
  return breakdowns.findLast(isComplete)
}

export interface TvlChanges {
  stake?: EthChange
  /** None when the period's end day has no supply. */
  supply?: EthChange
}

/**
 * The changes over the chart's period, never past `latest`, ending on the
 * period's last day with stake so both end the same day.
 */
export function getTvlChanges(
  breakdowns: TvlBreakdown[],
  latest: CompleteTvlBreakdown,
): TvlChanges {
  const upToLatest = breakdowns.filter(
    (breakdown) => breakdown.timestamp <= latest.timestamp,
  )
  const end = upToLatest.findLast(
    (breakdown) => breakdown.staked !== null && breakdown.staked > 0,
  )
  if (!end) {
    return {
      stake: undefined,
      supply: getChange(upToLatest, (b) => b.supply),
    }
  }
  const period = upToLatest.filter(
    (breakdown) => breakdown.timestamp <= end.timestamp,
  )
  return {
    stake: getChange(period, (b) => b.staked),
    supply:
      end.supply !== null && end.supply > 0
        ? getChange(period, (b) => b.supply)
        : undefined,
  }
}

/** From the first known value to the last. */
export function getChange(
  breakdowns: TvlBreakdown[],
  pick: (breakdown: TvlBreakdown) => number | null,
): EthChange | undefined {
  const known = breakdowns.flatMap((breakdown) => {
    const value = pick(breakdown)
    return value !== null && value > 0
      ? [{ timestamp: breakdown.timestamp, value }]
      : []
  })
  const first = known.at(0)
  const latest = known.at(-1)
  if (!first || !latest || first === latest) return undefined
  return {
    value: latest.value / first.value - 1,
    eth: latest.value - first.value,
    since: first.timestamp,
    until: latest.timestamp,
  }
}
